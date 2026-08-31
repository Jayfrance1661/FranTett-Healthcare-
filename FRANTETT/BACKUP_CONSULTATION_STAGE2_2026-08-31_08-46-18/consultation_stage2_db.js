require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT)
});

async function main() {

    const client = await pool.connect();

    try {

        console.log("");
        console.log("Inspecting clinical tables...");
        console.log("");

        const tablesResult = await client.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            ORDER BY table_name
        `);

        const tables =
            tablesResult.rows.map(
                row => row.table_name
            );

        console.log("Tables found:");

        for (const table of tables) {
            console.log("  " + table);
        }

        console.log("");

        const clinicalCandidates = [
            "lab_results",
            "laboratory_results",
            "lab_result",
            "laboratory_result"
        ];

        const resultTables =
            clinicalCandidates.filter(
                name => tables.includes(name)
            );

        if (resultTables.length === 0) {

            console.log(
                "No conventional laboratory-results table was found."
            );

            console.log(
                "No laboratory-results table was changed."
            );

        } else {

            console.log(
                "Laboratory result table(s):"
            );

            for (const table of resultTables) {
                console.log("  " + table);
            }

            for (const table of resultTables) {

                const columnsResult =
                    await client.query(
                        `
                        SELECT
                            column_name,
                            data_type
                        FROM information_schema.columns
                        WHERE table_schema = 'public'
                          AND table_name = $1
                        ORDER BY ordinal_position
                        `,
                        [table]
                    );

                const columns =
                    columnsResult.rows.map(
                        row => row.column_name
                    );

                console.log("");
                console.log(
                    "Columns in " + table + ":"
                );

                for (const column of columns) {
                    console.log("  " + column);
                }

                if (
                    !columns.includes(
                        "consultation_id"
                    )
                ) {

                    await client.query(
                        `
                        ALTER TABLE "${table}"
                        ADD COLUMN consultation_id INTEGER
                        `
                    );

                    console.log(
                        "Added consultation_id to " +
                        table
                    );

                } else {

                    console.log(
                        table +
                        ".consultation_id already exists."
                    );

                }

                await client.query(
                    `
                    CREATE INDEX IF NOT EXISTS
                    "${table}_consultation_id_idx"
                    ON "${table}" (consultation_id)
                    `
                );

                /*
                 * Attempt to discover whether this result table
                 * has a lab_request_id. If so, existing results
                 * can inherit the consultation from the request.
                 */

                if (
                    columns.includes(
                        "lab_request_id"
                    )
                ) {

                    console.log(
                        "Found lab_request_id on " +
                        table +
                        "."
                    );

                    const updateResult =
                        await client.query(
                            `
                            UPDATE "${table}" r
                            SET consultation_id =
                                lr.consultation_id
                            FROM lab_requests lr
                            WHERE r.lab_request_id = lr.id
                              AND r.consultation_id IS NULL
                              AND lr.consultation_id IS NOT NULL
                            `
                        );

                    console.log(
                        "Existing laboratory results linked:"
                    );

                    console.log(
                        "  " +
                        updateResult.rowCount
                    );

                } else {

                    console.log(
                        "No lab_request_id column found."
                    );

                    console.log(
                        "Existing result rows were NOT guessed or reassigned."
                    );

                }
            }
        }

        /*
         * Verify vital_signs.
         */

        const vitalColumns =
            await client.query(
                `
                SELECT column_name
                FROM information_schema.columns
                WHERE table_schema = 'public'
                  AND table_name = 'vital_signs'
                  AND column_name = 'consultation_id'
                `
            );

        console.log("");

        console.log(
            "vital_signs.consultation_id: " +
            (
                vitalColumns.rows.length
                    ? "READY"
                    : "MISSING"
            )
        );

        /*
         * Verify lab_requests.
         */

        const labColumns =
            await client.query(
                `
                SELECT column_name
                FROM information_schema.columns
                WHERE table_schema = 'public'
                  AND table_name = 'lab_requests'
                  AND column_name = 'consultation_id'
                `
            );

        console.log(
            "lab_requests.consultation_id: " +
            (
                labColumns.rows.length
                    ? "READY"
                    : "MISSING"
            )
        );

        /*
         * Verify prescriptions.
         */

        const prescriptionColumns =
            await client.query(
                `
                SELECT column_name
                FROM information_schema.columns
                WHERE table_schema = 'public'
                  AND table_name = 'prescriptions'
                  AND column_name = 'consultation_id'
                `
            );

        console.log(
            "prescriptions.consultation_id: " +
            (
                prescriptionColumns.rows.length
                    ? "READY"
                    : "MISSING"
            )
        );

        /*
         * Verify consultation counts.
         */

        console.log("");
        console.log(
            "Current consultation-linked record counts:"
        );

        const countQueries = [
            [
                "vital_signs",
                `
                SELECT COUNT(*) AS count
                FROM vital_signs
                WHERE consultation_id IS NOT NULL
                `
            ],
            [
                "lab_requests",
                `
                SELECT COUNT(*) AS count
                FROM lab_requests
                WHERE consultation_id IS NOT NULL
                `
            ],
            [
                "prescriptions",
                `
                SELECT COUNT(*) AS count
                FROM prescriptions
                WHERE consultation_id IS NOT NULL
                `
            ]
        ];

        for (
            const [name, query]
            of countQueries
        ) {

            try {

                const result =
                    await client.query(query);

                console.log(
                    "  " +
                    name +
                    ": " +
                    result.rows[0].count
                );

            } catch (error) {

                console.log(
                    "  " +
                    name +
                    ": unable to count"
                );

            }

        }

        console.log("");
        console.log(
            "DATABASE STAGE 2 COMPLETED."
        );

    } finally {

        client.release();

    }
}

main()
    .catch(error => {

        console.error("");
        console.error(
            "DATABASE STAGE 2 FAILED."
        );

        console.error(error);

        process.exitCode = 1;

    })
    .finally(async () => {

        await pool.end();

    });

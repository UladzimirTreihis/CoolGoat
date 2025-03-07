/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 export async function up(knex) {
    await knex.schema.createTable('test_table', (table) => {
      table.increments('id').primary(); // Auto-incrementing ID column
      table.string('name').notNullable(); // String column for 'name'
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  export async function down(knex) {
    await knex.schema.dropTableIfExists('test_table'); // Drops the table if it exists
  };
  

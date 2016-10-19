<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
    	DB::unprepared(file_get_contents('./database/seeds/dump/mz_2016-10-20.sql'));
    	$this->command->info('Seed: column added successfully.');
    }
}

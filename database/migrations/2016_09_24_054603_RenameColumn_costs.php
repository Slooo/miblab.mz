<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RenameColumnCosts extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('costs', function($table)
        {
            $table->renameColumn('price', 'sum');
            $table->renameColumn('added_at', 'date');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('costs', function($table)
        {
            $table->renameColumn('sum', 'price');
            $table->renameColumn('date', 'added_at');
        });    
    }
}

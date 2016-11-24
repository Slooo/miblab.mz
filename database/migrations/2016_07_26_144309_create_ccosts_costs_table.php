<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCcostsCostsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ccosts_costs', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('ccosts_id');
            $table->integer('costs_id')->unsigned()->index();
            $table->foreign('costs_id')->references('id')->on('costs')->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('ccosts_costs');
    }
}

<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateItemsSupply extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('items_supply', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('items_id');
            $table->float('items_price');
            $table->integer('items_quantity');
            $table->float('items_sum');
            $table->integer('supply_id')->unsigned()->index();
            $table->foreign('supply_id')->references('id')->on('supply')->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('items_supply');
    }
}

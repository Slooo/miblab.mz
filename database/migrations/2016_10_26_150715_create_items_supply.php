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
            $table->string('items_price');
            $table->string('items_price_discount');
            $table->string('items_quantity');
            $table->string('items_sum');
            $table->integer('supply_id')->unsigned()->index();
            $table->integer('point');
            $table->timestamps();
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

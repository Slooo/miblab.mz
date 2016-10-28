<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateItemsOrders extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('items_orders', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('items_id');
            $table->string('items_price');
            $table->string('items_price_discount');
            $table->string('items_quantity');
            $table->string('items_sum');
            $table->integer('orders_id')->unsigned()->index();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('items_orders');
    }
}

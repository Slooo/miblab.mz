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
            $table->float('items_price');
            $table->integer('items_quantity');
            $table->float('items_sum');
            $table->integer('orders_id')->unsigned()->index();
            $table->foreign('orders_id')->references('id')->on('orders')->onUpdate('cascade')->onDelete('cascade');
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

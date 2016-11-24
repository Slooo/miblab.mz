<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStockTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('stock', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('items_id')->unsigned()->index();
            $table->foreign('items_id')->references('id')->on('items')->onUpdate('cascade')->onDelete('cascade');
            $table->integer('items_quantity');
            $table->integer('points_id')->unsigned();
            $table->foreign('points_id')->references('id')->on('points')->onUpdate('cascade')->onDelete('cascade');
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
        Schema::drop('stock');
    }
}

<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSupplyTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('supply', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('barcode');
            $table->string('price');
            $table->string('price_discount');
            $table->string('quantity');
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
        Schema::drop('supply');
    }
}

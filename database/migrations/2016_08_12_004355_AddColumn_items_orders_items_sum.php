<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColumnItemsOrdersItemsSum extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('items_orders', function (Blueprint $table) {
            $table->string('items_sum')->after('items_quantity');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('items_orders', function (Blueprint $table) {
            $table->dropColumn('items_sum');
        });
    }
}
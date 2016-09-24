<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RenameColumnOrders extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('orders', function($table)
        {
            $table->renameColumn('price', 'sum');
            $table->dropColumn('remember_token');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('orders', function($table)
        {
            $table->renameColumn('sum', 'price');
            $table->string('remember_token')->after('type');
        });
    }
}

<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DeleteItemsColumnPoint extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasColumn('items', 'quantity') && (Schema::hasColumn('items', 'point')))
        {
            Schema::table('items', function ($table) {
                $table->dropColumn(['quantity', 'point']);
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('items', function($table) {
            $table->string('quantity')->after('price');
            $table->integer('point')->after('status');
        });
    }
}

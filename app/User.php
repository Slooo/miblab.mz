<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{    
    protected $fillable = [
        'name', 'password', 'status', 'point',
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    public function isCashier()
    {
        if($this->status == 2)
        {
            return true;
        } else {
            return false;
        }
    }

    public function isAdmin()
    {
        if($this->status == 1)
        {
            return true;
        } else {
            return false;
        }
    }

    public function isManage()
    {
        if($this->status == 0)
        {
            return true;
        } else {
            return false;
        }
    }

}

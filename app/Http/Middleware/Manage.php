<?php

namespace App\Http\Middleware;

use Closure;
use Auth;

class Manage
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if ( Auth::check() && Auth::user()->isManage() )
        {
            return $next($request);
        }

        return redirect('manage/analytics');   
    }
}

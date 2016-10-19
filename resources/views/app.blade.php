<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="utf-8">
    <meta name="description" content="Главная страница сайта" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="keywords" content="mz" />
    <meta name="_token" content="{{ csrf_token() }}">
    <title>Касса</title>
	
    <!-- Styles -->
    <link rel="stylesheet" href="{{ elixir('css/app.css') }}">

    <!-- Scripts -->
    <script src="{{ elixir('js/libs.js') }}"></script>

</head>
<body>
    <nav class="navbar navbar-default navbar-static-top">
        <div class="container">
            <div class="navbar-header">

                <!-- Collapsed Hamburger -->
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#app-navbar-collapse">
                    <span class="sr-only">Навигация</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>

                <!-- Branding Image -->
                <a class="navbar-brand" href="{{ url('/') }}">
                    MZ
                </a>

                @if (Auth::check())
                    <a class="navbar-brand" href="{{ url('/') }}">
                        @if(Auth::user()->point > 0) Торговая точка #{{ Auth::user()->point }} @endif
                    </a>
                @endif

            </div>

            <div class="collapse navbar-collapse" id="app-navbar-collapse">
                <ul class="nav navbar-nav navbar-right">
                    <!-- Authentication Links -->
                    @if (Auth::guest())
                    @else
                        @if (Request::is('admin/*') || Request::is('manage/*'))
                        <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
                                настройки <span class="caret"></span>
                            </a>

                            <ul class="dropdown-menu dropdown-menu--lg" role="menu">
                                <li class="dropdown-header">Выбрать период</li>
                                <li>@include('_forms.date')</li>
                                <li class="divider"></li>
                            </ul>
                        </li>
                        @endif

                        <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
                                {{ Auth::user()->username }} <span class="caret"></span>
                            </a>

                            <ul class="dropdown-menu" role="menu">
                            @if(Auth::user()->status == 2)
                                <li><a href="{{ url('cashier/search') }}">Поиск товаров</a></li>
                                <li><a href="{{ url('cashier/orders') }}">Заказы</a></li>
                            @elseif(Auth::user()->status == 1)
                                <li><a href="{{ url('admin/items') }}">Все товары</a></li>
                                <li><a href="{{ url('admin/items/create') }}">Добавить товар</a></li>
                                <li><a href="{{ url('admin/costs') }}">Учет расходов</a></li>
                                <li><a href="{{ url('admin/costs/create') }}">Добавить расходы</a></li>
                                <li><a href="{{ url('admin/orders') }}">Заказы</a></li>
                                <li><a href="{{ url('admin/supply/create') }}">Добавить приход</a></li>
                                <li><a href="{{ url('admin/supply') }}">Приходы</a></li>
                            @elseif(Auth::user()->status == 0)
                                <li><a href="{{ url('manage/analytics') }}">Аналитика</a></li>
                                <li><a href="{{ url('manage/orders') }}">Заказы</a></li>
                                <li><a href="{{ url('manage/costs') }}">Учет расходов</a></li>
                            @endif
                                <li><a href="{{ url('/logout') }}"><i class="fa fa-btn fa-sign-out"></i>Выйти</a></li>
                            </ul>
                        </li>
                    @endif
                </ul>
            </div>
        </div>
    </nav>
        
    <!-- Content -->
    <div class="container">
        <div class="row">
        	<div id="alert"></div>
        </div>
        @yield('content')
    </div>

    <!-- JavaScripts -->
    <script>
    var base_url, segment1, segment2;
        base_url = '{{ url('/') }}/';
        segment1 = '{{ Request::segment(1) }}';   
        segment2 = '{{ Request::segment(2) }}';  
    </script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
    <script src="{{ elixir('js/app.js') }}"></script>
    @yield('script')

    <style>
.dropdown-menu--lg {
    width:300px;
}
</style>

</body>
</html>
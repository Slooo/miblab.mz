<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="utf-8">
    <meta name="description" content="Главная страница сайта" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="keywords" content="Сайт, о том, о сём" />
    <meta name="_token" content="{{ csrf_token() }}">
    <title>Касса</title>
	
	<!-- Icon -->
    <link rel="shortcut icon" href="favicon.png" />

    <!-- Fonts -->
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css" />

    <!-- Styles -->
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" />    
    <link rel="stylesheet" href="{{ elixir('css/app.css') }}">

    <script src="//code.jquery.com/jquery.js"></script>
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
                    Имя организации
                </a>

                @if (Auth::check())
                    <a class="navbar-brand" href="{{ url('/') }}">
                        Торговая точка #{{ Auth::user()->point }}
                    </a>
                @endif

            </div>

            <div class="collapse navbar-collapse" id="app-navbar-collapse">
                <ul class="nav navbar-nav navbar-right">
                    <!-- Authentication Links -->
                    @if (Auth::guest())
                    @else
                        <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
                                {{ Auth::user()->username }} <span class="caret"></span>
                            </a>

                            <ul class="dropdown-menu" role="menu">
                                @if(Auth::user()->status == 0)
                                    <li><a href="{{ url('items/cashier') }}">Поиск товаров</a></li>
                                    <li><a href="{{ url('order') }}">Заказы</a></li>
                                @elseif(Auth::user()->status == 1)
                                    <li><a href="{{ url('items') }}">Все товары</a></li>
                                    <li><a href="{{ url('items/create') }}">Добавить товар</a></li>
                                    <li><a href="{{ url('costs') }}">Учет расходов</a></li>
                                    <li><a href="{{ url('costs/create') }}">Добавить расходы</a></li>
                                    <li><a href="{{ url('order') }}">Заказы</a></li>
                                @endif
                                <li><a href="{{ url('/logout') }}"><i class="fa fa-btn fa-sign-out"></i>Выйти</a></li>
                            </ul>
                        </li>
                    @endif
                </ul>
            </div>
        </div>
    </nav>
    
    <div class="container">
        <div class="row">
        	<div id="alert"></div>
        </div>
        @yield('content')
    </div>

    <!-- JavaScripts -->
    <script>base_url = '{{ url('/') }}/';</script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
    <script src="{{ elixir('js/app.js') }}"></script>
    @yield('script')
</body>
</html>
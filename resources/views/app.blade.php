<!-- 

    Index page 

-->

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
                        @if(Auth::user()->points_id > 0) Торговая точка #{{ Auth::user()->points_id }} @endif
                    </a>
                @endif

            </div>

            <div class="collapse navbar-collapse" id="app-navbar-collapse">
                <ul class="nav navbar-nav navbar-right">
                    <!-- Authentication Links -->
                    @if (Auth::guest())
                    @else
                        <?php $status = Auth::user()->status;?>

                        <!-- Menu links -->
                        <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
                                {{ Auth::user()->username }} <span class="caret"></span>
                            </a>

                            <ul class="dropdown-menu" role="menu">
                            @if(Auth::user()->status == 1)
                                <li><a href="{{ url('cashier/items') }}">Товары</a></li>
                                <li><a href="{{ url('cashier/orders') }}">Заказы</a></li>
                            @elseif(Auth::user()->status == 2)
                                <li><a href="{{ url('manage/items') }}">Товары</a></li>
                                <li><a href="{{ url('manage/orders') }}">Заказы</a></li>
                                <li><a href="{{ url('manage/supply') }}">Приходы</a></li>
                                <li><a href="{{ url('manage/costs') }}">Расходы</a></li>
                                <li><a href="{{ url('manage/analytics') }}">Аналитика</a></li>
                            @elseif(Auth::user()->status == 3)
                                <li><a href="{{ url('admin/items') }}">Товары</a></li>
                                <li><a href="{{ url('admin/orders') }}">Заказы</a></li>
                                <li><a href="{{ url('admin/supply') }}">Приходы</a></li>
                                <li><a href="{{ url('admin/costs') }}">Расходы</a></li>
                                <li><a href="{{ url('admin/discounts') }}">Скидки</a></li>
                            @elseif(Auth::user()->status == 4)
                                <li><a href="{{ url('igor/items') }}">Товары</a></li>
                                <li><a href="{{ url('igor/orders') }}">Заказы</a></li>
                                <li><a href="{{ url('igor/supply') }}">Приходы</a></li>
                                <li><a href="{{ url('igor/costs') }}">Расходы</a></li>
                                <li><a href="{{ url('igor/analytics') }}">Аналитика</a></li>
                                <li><a href="{{ url('igor/discounts') }}">Скидки</a></li>
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

            @if(Session::has('message'))
                <div id="alert" class="alert alert-info">{{ Session::get('message') }}</div>
            @else
                <div id="alert"></div>    
            @endif

            @include('_forms.modals')
        </div>
        @yield('content')
    </div>

    <!-- JavaScripts -->
    <script>
    var base_url, segment1, segment2, segment3, points_id, status;
        base_url  = '{{ url('/') }}';
        segment1  = '{{ Request::segment(1) }}';   
        segment2  = '{{ Request::segment(2) }}';
        segment3  = '{{ Request::segment(3) }}';
    @if(Auth::user())
    var userOptions = {};
        userOptions.status    = {{ Auth::user()->status }};
        userOptions.points_id = {{ Auth::user()->points_id }};
    @endif
    </script>
    <script src="{{ elixir('js/app.js') }}"></script>
    @yield('script')

</body>
</html>
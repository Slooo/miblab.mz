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
    <script src="{{ elixir('js/app.js') }}"></script>

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
            
            <!-- Authentication Links -->
            <div class="collapse navbar-collapse" id="app-navbar-collapse">
                <ul class="nav navbar-nav navbar-right">
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
    var base_url, segment1, segment2, segment3;
        base_url  = '{{ url('/') }}';
        segment1  = '{{ Request::segment(1) }}';   
        segment2  = '{{ Request::segment(2) }}';
        segment3  = '{{ Request::segment(3) }}';
    @if(Auth::user())
    var userOptions = {};
        userOptions.username  = "{{ Auth::user()->username }}";
        userOptions.status    = {{ Auth::user()->status }};
        userOptions.points_id = {{ Auth::user()->points_id }};
    @endif
    </script>

    @yield('script')
</body>
</html>
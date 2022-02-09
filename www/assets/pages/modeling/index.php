<?php header('Content-Type: text/html; charset=utf-8'); ?>
<!doctype html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <title>APS</title>
    <link rel="stylesheet" href="/assets/style/css/gilroy.css">
    <link rel="stylesheet" href="/assets/style/css/header.css">
    <link rel="stylesheet" href="/assets/style/css/main.css">
    <link rel="stylesheet" href="/assets/style/css/loader.css">
    <link rel="stylesheet" href="/assets/style/css/modeling.css">
    <script src="/assets/js/utils.js"></script>
    <?php include('../../../assets/pages/modeling_classes.php') ?>
</head>
<?php include('../../../assets/pages/header.php')?>
<body>
<div class="content">
    <div class="content_container">
        <div class="inputs_block">
            <div class="model_inputs">
                <div class="generators_number input_block">
                    <label for="generators">Количество генераторов</label>
                    <input type="number" name="generators" id="generators" placeholder="10">
                </div>
                <div class="buffers_number input_block">
                    <label for="buffers">Количество буфферов</label>
                    <input type="number" name="buffers" id="buffers" placeholder="2">
                </div>
                <div class="handlers_number input_block">
                    <label for="handlers">Количество обработчиков</label>
                    <input type="number" name="handlers" id="handlers" placeholder="1">
                </div>
            </div>
            <div class="requests_number input_block">
                <label for="requests">Количество заявок</label>
                <input type="number" name="requests" id="requests" placeholder="100">
            </div>
        </div>
        <div class="button">Сгенерировать</div>
        <div class="title hidden full">Статистика генераторов:</div>
        <div class="generators_statistic hidden full">
            <div class="header">
                <div class="number">Номер</div>
                <div class="number_of_requests">Кол-во заявок</div>
                <div class="probability_of_refuse">Вероятность отказа</div>
                <div class="avg_time_of_work">Время пребывания</div>
                <div class="avg_time_of_handling">Время обработки</div>
                <div class="avg_time_of_buffering">Время ожидания</div>
            </div>
            <div class="generators_statistic_list"></div>
        </div>
        <div class="title hidden full">Статистика приборов:</div>
        <div class="handlers_statistic hidden full">
            <div class="header">
                <div class="number">Номер</div>
                <div class="rate_of_usability">Коэф. использованиия</div>
            </div>
            <div class="handlers_statistic_list"></div>
        </div>
        <div class="title hidden full">Список заявок:</div>
        <div class="loader hidden full">
            <div class="sk-chase">
                <div class="sk-chase-dot"></div>
                <div class="sk-chase-dot"></div>
                <div class="sk-chase-dot"></div>
                <div class="sk-chase-dot"></div>
                <div class="sk-chase-dot"></div>
                <div class="sk-chase-dot"></div>
            </div>
        </div>
        <div class="requests_list hidden full">
        </div>
    </div>
</div>
<div class="request hidden full"></div>
<div class="generator_statistic_line hidden full">
    <div class="number"></div>
    <div class="number_of_requests"></div>
    <div class="probability_of_refuse"></div>
    <div class="avg_time_of_work"></div>
    <div class="avg_time_of_buffering"></div>
    <div class="avg_time_of_handling"></div>
</div>
<div class="handlers_statistic_line hidden full">
    <div class="number"></div>
    <div class="rate_of_usability"></div>
</div>
</body>
<script src="/assets/js/modeling.js"></script>
</html>
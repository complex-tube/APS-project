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
    <link rel="stylesheet" href="/assets/style/css/automatic.css">
    <link rel="stylesheet" href="/assets/style/css/manual.css">
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
                    <input type="number" name="handlers" id="handlers" placeholder="5">
                </div>
            </div>
            <div class="requests_number input_block">
                <label for="requests">Количество заявок</label>
                <input type="number" name="requests" id="requests" placeholder="100">
            </div>
        </div>
        <div class="button generate">Сгенерировать</div>
        <div class="button step_forward hidden full">Шаг вперед</div>
        <div class="timing_diagram hidden full">
            <div class="titles">
            </div>
            <div class="values">
                <div class="generators">
                </div>
                <div class="handlers">
                </div>
                <div class="buffers">
                </div>
                <div class="refuses">
                </div>
                <div class="times">
                </div>
            </div>
        </div>
<!--        <canvas class="chart" width="1" height="1"></canvas>-->
    </div>
</div>
<div class="generator_title title hidden full"></div>
<div class="handler_title title hidden full"></div>
<div class="buffer_title title hidden full"></div>
<div class="refuse_title title hidden full"></div>
<div class="time_title title hidden full"></div>
<div class="generator hidden full"></div>
<div class="handler hidden full"></div>
<div class="buffer hidden full"></div>
<div class="request hidden full"></div>
<div class="time hidden full"></div>
</body>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="https://cdn.plot.ly/plotly-2.8.3.min.js"></script>
<script src="/assets/js/chart-drawer.js"></script>
<script src="/assets/js/manual.js"></script>
</html>

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
    <script src="/assets/js/utils.js"></script>
    <?php include('../../../assets/pages/modeling_classes.php') ?>
</head>
<?php include('../../../assets/pages/header.php')?>
<body>
<div class="content">
    <div class="content_container">
        <div class="title">Выберите устройство для моделирования:</div>
        <div class="device_picker">
            <div class="generator radio">
                <input type="radio" name="device" id="generator" value="generator">
                <label for="generator">Генератор</label>
            </div>
            <div class="buffer radio">
                <input type="radio" name="device" id="buffer" value="buffer">
                <label for="buffer">Буфер</label>
            </div>
            <div class="handler radio">
                <input type="radio" name="device" id="handler" value="handler">
                <label for="handler">Прибор</label>
            </div>
        </div>
        <div class="inputs_block">
            <div class="model_inputs">
                <div class="generators_number input_block">
                    <label for="generators">Количество генераторов</label>
                    <input type="number" name="generators" id="generators" placeholder="">
                </div>
                <div class="buffers_number input_block">
                    <label for="buffers">Количество буферов</label>
                    <input type="number" name="buffers" id="buffers" placeholder="">
                </div>
                <div class="handlers_number input_block">
                    <label for="handlers">Количество обработчиков</label>
                    <input type="number" name="handlers" id="handlers" placeholder="">
                </div>
            </div>
            <div class="requests_number input_block">
                <label for="requests">Количество заявок</label>
                <input type="number" name="requests" id="requests" placeholder="">
            </div>
        </div>
        <div class="button modeling">Сгенерировать</div>
        <canvas class="chart hidden full" width="2" height="1"></canvas>
    </div>
</div>
</body>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="/assets/js/automatic.js"></script>
</html>

<?php

declare(strict_types=1);

// Run with: php backend/tests/garden_access.php
// Every case uses an isolated SQLite database in memory, never the application database.
if (($argv[1] ?? '') === '--case') {
    require dirname(__DIR__).'/controllers/Controller.php';
    require dirname(__DIR__).'/middleware/AuthMiddleware.php';
    require dirname(__DIR__).'/controllers/GardenController.php';
    $case = json_decode($argv[2],true,512,JSON_THROW_ON_ERROR);
    $db = new PDO('sqlite::memory:',null,null,[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC]);
    $db->exec("CREATE TABLE perfil (id INTEGER PRIMARY KEY,nome TEXT);
        CREATE TABLE instituicao (id INTEGER PRIMARY KEY,nome TEXT);
        CREATE TABLE turma_escolar (id INTEGER PRIMARY KEY,nome TEXT,ano_letivo INTEGER,instituicao_id INTEGER);
        CREATE TABLE turma_professor (turma_id INTEGER,professor_id INTEGER);
        CREATE TABLE usuario (id INTEGER PRIMARY KEY,nome TEXT,perfil_id INTEGER,turma_id INTEGER,instituicao_id INTEGER);
        CREATE TABLE missao (id INTEGER PRIMARY KEY,titulo TEXT,tipo TEXT);
        CREATE TABLE submissao_missao (id INTEGER PRIMARY KEY,aluno_id INTEGER,missao_id INTEGER,descricao TEXT,url_foto TEXT,status TEXT,data_envio TEXT,revisado_em TEXT,comentario_professor TEXT,revisado_por INTEGER);
        INSERT INTO perfil VALUES (1,'aluno'),(2,'professor'),(3,'diretor'),(4,'admin');
        INSERT INTO instituicao VALUES (10,'Escola A'),(20,'Escola B'),(30,'Escola vazia');
        INSERT INTO turma_escolar VALUES (11,'Turma A',2026,10),(12,'Turma B',2026,10),(21,'Turma C',2026,20),(13,'Turma vazia',2026,10);
        INSERT INTO usuario VALUES (100,'Professor A',2,NULL,10),(101,'Professor sem turmas',2,NULL,10),
            (200,'Diretor A',3,NULL,10),(201,'Diretor sem escola',3,NULL,NULL),(300,'Admin',4,NULL,NULL),
            (401,'Aluno A',1,11,10),(402,'Aluno B',1,12,10),(403,'Aluno C',1,21,20);
        INSERT INTO turma_professor VALUES (11,100);
        INSERT INTO missao VALUES (1,'Plantio','plant'),(2,'Rega','water');");
    $insert = $db->prepare('INSERT INTO submissao_missao VALUES (?,?,?,?,?,?,?,?,?,?)');
    for ($id=1; $id<=15; $id++) {
        $approved = $id % 2 === 0;
        $insert->execute([$id,401,$approved ? 2 : 1,'Descricao '.$id,'',$approved ? 'approved' : 'pending',sprintf('2026-09-%02d 10:00:00',$id),$approved ? sprintf('2026-09-%02d 12:00:00',$id) : null,$approved ? 'Bom trabalho' : null,$approved ? 100 : null]);
    }
    $insert->execute([99,402,1,'Envio de outra turma','','rejected','2026-09-16 10:00:00','2026-09-16 12:00:00','Reenviar',100]);
    $insert->execute([100,403,1,'Envio de outra escola','','pending','2026-09-17 10:00:00',null,null,null]);
    $_SESSION = isset($case['user']) ? ['usuario_id'=>$case['user']] : [];
    $_GET = $case['query'] ?? [];
    ob_start();
    register_shutdown_function(static function (): void {
        $body = ob_get_clean();
        echo json_encode(['status'=>http_response_code() ?: 200,'body'=>json_decode($body,true)],JSON_UNESCAPED_UNICODE);
    });
    $controller = new Viridis\controllers\GardenController($db,new Viridis\middleware\AuthMiddleware($db));
    $case['action'] === 'detail' ? $controller->detail($case['id']) : $controller->{$case['action']}();
}

$cases = [
    ['Admin lists schools',['user'=>300,'action'=>'schools'],200,fn($b)=>count($b['escolas'])===3],
    ['Admin selects school',['user'=>300,'action'=>'classes','query'=>['instituicao_id'=>10]],200,fn($b)=>count($b['turmas'])===3 && (int)$b['escola']['id']===10],
    ['Admin opens another school',['user'=>300,'action'=>'detail','id'=>21],200,fn($b)=>$b['registros'][0]['id']===100],
    ['Teacher sees assigned class only',['user'=>100,'action'=>'classes'],200,fn($b)=>array_column($b['turmas'],'id')===[11]],
    ['Teacher cannot override school',['user'=>100,'action'=>'classes','query'=>['instituicao_id'=>20]],200,fn($b)=>array_column($b['turmas'],'id')===[11]],
    ['Unassigned teacher sees no classes',['user'=>101,'action'=>'classes'],200,fn($b)=>$b['turmas']===[]],
    ['Teacher cannot open unassigned class',['user'=>100,'action'=>'detail','id'=>12],404],
    ['Teacher cannot open another school',['user'=>100,'action'=>'detail','id'=>21],404],
    ['Director sees all school classes',['user'=>200,'action'=>'classes'],200,fn($b)=>array_column($b['turmas'],'id')===[11,12,13]],
    ['Director opens school class',['user'=>200,'action'=>'detail','id'=>12],200,fn($b)=>$b['registros'][0]['id']===99],
    ['Director cannot open another school',['user'=>200,'action'=>'detail','id'=>21],404],
    ['Director without school sees nothing',['user'=>201,'action'=>'classes'],200,fn($b)=>$b['turmas']===[]],
    ['Teacher cannot list schools',['user'=>100,'action'=>'schools'],403],
    ['Student cannot list classes',['user'=>401,'action'=>'classes'],403],
    ['Student cannot open class history',['user'=>401,'action'=>'detail','id'=>11],403],
    ['Anonymous request rejected',['action'=>'schools'],401],
    ['History scoped, sorted and paginated',['user'=>100,'action'=>'detail','id'=>11],200,fn($b)=>count($b['registros'])===12 && $b['registros'][0]['id']===15 && $b['paginacao']['total']===15 && (int)$b['resumo']['pendentes']===8],
    ['Second page has remaining rows',['user'=>100,'action'=>'detail','id'=>11,'query'=>['pagina'=>2]],200,fn($b)=>array_column($b['registros'],'id')===[3,2,1]],
    ['Updates contain reviewed submissions only',['user'=>100,'action'=>'detail','id'=>11,'query'=>['aba'=>'alteracoes']],200,fn($b)=>count($b['registros'])===7 && $b['registros'][0]['id']===14 && $b['registros'][0]['revisor']==='Professor A'],
    ['Status and activity filters combine',['user'=>100,'action'=>'detail','id'=>11,'query'=>['status'=>'approved','tipo'=>'plant']],200,fn($b)=>$b['registros']===[]],
    ['Activity filter',['user'=>100,'action'=>'detail','id'=>11,'query'=>['tipo'=>'water']],200,fn($b)=>count($b['registros'])===7],
    ['Empty class works',['user'=>200,'action'=>'detail','id'=>13],200,fn($b)=>$b['registros']===[] && (int)$b['resumo']['total_envios']===0],
    ['Invalid filter rejected',['user'=>100,'action'=>'detail','id'=>11,'query'=>['status'=>"' OR 1=1"]],422],
    ['Invalid page rejected',['user'=>100,'action'=>'detail','id'=>11,'query'=>['pagina'=>0]],422],
    ['Missing admin school rejected',['user'=>300,'action'=>'classes'],422],
    ['Unknown school rejected',['user'=>300,'action'=>'classes','query'=>['instituicao_id'=>999]],404],
];
$failed = 0;
foreach ($cases as $testCase) {
    [$name,$input,$status] = $testCase;
    $check = $testCase[3] ?? null;
    $process = proc_open([PHP_BINARY,__FILE__,'--case',json_encode($input)],[1=>['pipe','w'],2=>['pipe','w']],$pipes);
    $output = stream_get_contents($pipes[1]); $errors = stream_get_contents($pipes[2]);
    fclose($pipes[1]); fclose($pipes[2]); $exit = proc_close($process);
    $result = json_decode($output,true);
    $ok = $exit===0 && $errors==='' && ($result['status'] ?? 0)===$status && (!$check || $check($result['body']));
    echo ($ok ? 'PASS ' : 'FAIL ').$name.PHP_EOL;
    if (!$ok) { $failed++; echo $output.$errors.PHP_EOL; }
}
echo count($cases).' cases, '.$failed.' failures'.PHP_EOL;
exit($failed ? 1 : 0);

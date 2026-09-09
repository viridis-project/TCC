<?php
declare(strict_types=1);
if (PHP_SAPI!=='cli') { http_response_code(404);exit; }
// SQLite fixtures are in memory. Quiz scoring cases use connection-local MySQL TEMPORARY
// tables, which shadow application tables and disappear when the test connection closes.
if (($argv[1]??'')==='--case') {
    $case=json_decode($argv[2],true,512,JSON_THROW_ON_ERROR);
    spl_autoload_register(static function ($class): void { if (str_starts_with($class,'Viridis\\')) require dirname(__DIR__).'/'.str_replace('\\','/',substr($class,8)).'.php'; });
    $mysql=!empty($case['mysql']);
    if ($mysql) { $config=require dirname(__DIR__).'/config/bootstrap.php';$db=Viridis\config\Database::connection($config); }
    else $db=new PDO('sqlite::memory:',null,null,[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC]);
    $schema=[
        'perfil (id INTEGER PRIMARY KEY,nome VARCHAR(30))',
        'instituicao (id INTEGER PRIMARY KEY,nome VARCHAR(100))',
        'turma_escolar (id INTEGER PRIMARY KEY,nome VARCHAR(100),ano_letivo INTEGER,instituicao_id INTEGER)',
        'turma_professor (turma_id INTEGER,professor_id INTEGER)',
        'usuario (id INTEGER PRIMARY KEY,nome VARCHAR(100),perfil_id INTEGER,turma_id INTEGER,instituicao_id INTEGER,xp INTEGER DEFAULT 0,pontos_totais INTEGER DEFAULT 0,nivel INTEGER DEFAULT 1,xp_proximo_nivel INTEGER DEFAULT 200,streak_dias INTEGER DEFAULT 0,ultima_atividade_em DATE NULL)',
        "curso (id INTEGER PRIMARY KEY,titulo VARCHAR(150),descricao VARCHAR(1000) DEFAULT '',escopo VARCHAR(10),instituicao_id INTEGER NULL,turma_id INTEGER NULL,criador_id INTEGER NULL,publicado INTEGER DEFAULT 0,ativo INTEGER DEFAULT 1,criado_em DATETIME DEFAULT CURRENT_TIMESTAMP)",
        "modulo (id INTEGER PRIMARY KEY,curso_id INTEGER,titulo VARCHAR(100),descricao VARCHAR(255) DEFAULT '',cor VARCHAR(50) DEFAULT '#16803c',ordem INTEGER DEFAULT 1,ativo INTEGER DEFAULT 1)",
        "licao (id INTEGER PRIMARY KEY,modulo_id INTEGER,titulo VARCHAR(120),kind VARCHAR(20) DEFAULT 'lesson',xp INTEGER DEFAULT 20,ordem INTEGER DEFAULT 1,ativo INTEGER DEFAULT 1)",
        "pergunta_quiz (id INTEGER PRIMARY KEY,criador_id INTEGER,licao_id INTEGER,texto_pergunta VARCHAR(2000),explicacao VARCHAR(500) NULL,pontos_recompensa INTEGER DEFAULT 5,ativo INTEGER DEFAULT 1)",
        'opcao_quiz (id INTEGER PRIMARY KEY,pergunta_id INTEGER,texto_opcao VARCHAR(255),is_correta INTEGER)',
        'usuario_licao_progresso (usuario_id INTEGER,licao_id INTEGER,status VARCHAR(20),concluida_em DATETIME NULL,PRIMARY KEY(usuario_id,licao_id))',
        'progresso_quiz (id INTEGER PRIMARY KEY,aluno_id INTEGER,pergunta_id INTEGER,acertou INTEGER)',
        'conquista (id INTEGER PRIMARY KEY,regra VARCHAR(100))',
        'usuario_conquista (usuario_id INTEGER,conquista_id INTEGER,PRIMARY KEY(usuario_id,conquista_id))',
    ];
    foreach ($schema as $definition) $db->exec('CREATE '.($mysql?'TEMPORARY ':'').'TABLE '.($mysql?str_replace('INTEGER PRIMARY KEY,','INTEGER PRIMARY KEY AUTO_INCREMENT,',$definition):$definition));
    $db->exec("INSERT INTO perfil VALUES (1,'aluno'),(2,'professor'),(3,'diretor'),(4,'admin');");
    $db->exec("INSERT INTO instituicao VALUES (10,'Escola A'),(20,'Escola B')");
    $db->exec("INSERT INTO turma_escolar VALUES (11,'Turma A',2026,10),(12,'Turma B',2026,10),(21,'Turma C',2026,20)");
    $db->exec("INSERT INTO usuario (id,nome,perfil_id,turma_id,instituicao_id) VALUES (100,'Professor A',2,NULL,10),(101,'Professor B',2,NULL,20),(102,'Outro professor',2,NULL,10),(200,'Diretor A',3,NULL,10),(201,'Diretor B',3,NULL,20),(300,'Admin',4,NULL,NULL),(400,'Aluno A',1,11,10),(401,'Aluno B',1,12,10),(402,'Aluno C',1,21,20),(403,'Aluno sem escola',1,NULL,NULL)");
    $db->exec('INSERT INTO turma_professor VALUES (11,100),(12,100),(21,101),(11,102)');
    $db->exec("INSERT INTO curso (id,titulo,escopo,instituicao_id,turma_id,criador_id,publicado) VALUES (1,'Global','app',NULL,NULL,300,1),(2,'Escola A','escola',10,NULL,200,1),(3,'Turma A','turma',10,11,100,1),(4,'Turma B','turma',10,12,100,1),(5,'Escola B','escola',20,NULL,201,1),(6,'Turma C','turma',20,21,101,1),(7,'Outro professor','turma',10,11,102,1),(8,'Rascunho','app',NULL,NULL,300,0)");
    for ($id=1;$id<=7;$id++) {
        $db->exec("INSERT INTO modulo (id,curso_id,titulo) VALUES ($id,$id,'Modulo $id')");
        $db->exec("INSERT INTO licao (id,modulo_id,titulo) VALUES ($id,$id,'Licao $id')");
        $db->exec("INSERT INTO pergunta_quiz (id,criador_id,licao_id,texto_pergunta,explicacao) VALUES ($id,300,$id,'Pergunta $id','A explicacao pode conter o gabarito')");
        for($n=1;$n<=4;$n++) { $oid=$id*10+$n;$right=$n===1?1:0;$db->exec("INSERT INTO opcao_quiz VALUES ($oid,$id,'Opcao $n',$right)"); }
    }
    $db->exec("INSERT INTO licao (id,modulo_id,titulo,ordem) VALUES (99,1,'Segunda licao',2)");
    $db->exec("INSERT INTO pergunta_quiz (id,criador_id,licao_id,texto_pergunta) VALUES (99,300,99,'Segunda pergunta')");
    for($n=1;$n<=4;$n++) { $oid=990+$n;$right=$n===1?1:0;$db->exec("INSERT INTO opcao_quiz VALUES ($oid,99,'Opcao $n',$right)"); }
    foreach ($case['setup']??[] as $sql) $db->exec($sql);
    $_SESSION=isset($case['user'])?['usuario_id'=>$case['user']]:[];$_POST=$case['data']??[];$_GET=[];
    $_SERVER['REQUEST_METHOD']='POST';$_SERVER['CONTENT_TYPE']='application/x-www-form-urlencoded';
    ob_start();register_shutdown_function(static function () use ($db,$case): void {
        $body=json_decode(ob_get_clean(),true);$inspect=[];
        foreach ($case['inspect']??[] as $key=>$sql) $inspect[$key]=$db->query($sql)->fetchAll();
        echo json_encode(['status'=>http_response_code()?:200,'body'=>$body,'inspect'=>$inspect],JSON_UNESCAPED_UNICODE);
    });
    $auth=new Viridis\middleware\AuthMiddleware($db);
    try {
        if (($case['controller']??'learning')==='api') { $controller=new Viridis\controllers\ApiController($db,$auth,[]);$controller->{$case['action']}(...($case['args']??[])); }
        elseif ($case['action']==='modules') { echo json_encode(['modulos'=>(new Viridis\services\LearningAccess($db))->modules($auth->user())]);exit; }
        else { $controller=new Viridis\controllers\LearningController($db,$auth);$controller->{$case['action']}(...($case['args']??[])); }
    } catch (Viridis\services\LearningException $e) { http_response_code($e->getCode());echo json_encode(['erro'=>$e->getMessage()]);exit; }
}

$question=['licao_id'=>3,'texto_pergunta'=>'Qual pratica economiza agua?','explicacao'=>'Regar no horario adequado.','pontos_recompensa'=>5,'opcoes'=>[['texto_opcao'=>'Regar cedo','is_correta'=>true],['texto_opcao'=>'Desperdicar agua','is_correta'=>false],['texto_opcao'=>'Ignorar as plantas','is_correta'=>false],['texto_opcao'=>'Regar sem parar','is_correta'=>false]]];
$cases=[
    ['Admin manages global only',['user'=>300,'action'=>'courses'],200,fn($r)=>array_column($r['body']['cursos'],'id')===[8,1]],
    ['Director manages own school',['user'=>200,'action'=>'courses'],200,fn($r)=>array_column($r['body']['cursos'],'id')===[2]],
    ['Teacher manages own courses in assigned classes',['user'=>100,'action'=>'courses'],200,fn($r)=>array_column($r['body']['cursos'],'id')===[4,3] && count($r['body']['turmas'])===2],
    ['Teacher cannot edit other teacher course',['user'=>100,'action'=>'detail','args'=>[7]],404],
    ['Director cannot access another school',['user'=>200,'action'=>'detail','args'=>[5]],404],
    ['Student cannot manage',['user'=>400,'action'=>'courses'],403],
    ['Anonymous cannot manage',['action'=>'courses'],401],
    ['Student sees global, school and own class',['user'=>400,'action'=>'modules'],200,fn($r)=>array_values(array_unique(array_column($r['body']['modulos'],'curso_id')))===[1,2,3,7]],
    ['Different class sees different courses',['user'=>401,'action'=>'modules'],200,fn($r)=>array_column($r['body']['modulos'],'curso_id')===[1,2,4]],
    ['Other school isolated',['user'=>402,'action'=>'modules'],200,fn($r)=>array_column($r['body']['modulos'],'curso_id')===[1,5,6]],
    ['User without school sees global only',['user'=>403,'action'=>'modules'],200,fn($r)=>array_column($r['body']['modulos'],'curso_id')===[1]],
    ['Progress unlocks within each course',['user'=>400,'action'=>'modules'],200,fn($r)=>$r['body']['modulos'][0]['licoes'][0]['status']==='current' && $r['body']['modulos'][0]['licoes'][1]['status']==='locked' && $r['body']['modulos'][1]['licoes'][0]['status']==='current'],
    ['Completed lesson unlocks next',['user'=>400,'action'=>'modules','setup'=>["INSERT INTO usuario_licao_progresso VALUES (400,1,'completed',NULL)"]],200,fn($r)=>$r['body']['modulos'][0]['licoes'][1]['status']==='current'],
    ['Quiz does not expose answer or explanation',['user'=>400,'controller'=>'api','action'=>'quiz','args'=>[1]],200,fn($r)=>!isset($r['body']['perguntas'][0]['explicacao']) && !isset($r['body']['perguntas'][0]['opcoes'][0]['is_correta'])],
    ['Direct quiz URL blocked across classes',['user'=>400,'controller'=>'api','action'=>'quiz','args'=>[4]],404],
    ['Locked lesson blocked in API',['user'=>400,'controller'=>'api','action'=>'quiz','args'=>[99]],403],
    ['Admin creates draft global course',['user'=>300,'action'=>'createCourse','data'=>['titulo'=>'Curso global','descricao'=>'Teste','turma_id'=>21,'escopo'=>'turma'],'inspect'=>['course'=>'SELECT escopo,publicado,turma_id FROM curso WHERE id=9']],201,fn($r)=>$r['inspect']['course'][0]['escopo']==='app' && (int)$r['inspect']['course'][0]['publicado']===0 && $r['inspect']['course'][0]['turma_id']===null],
    ['Director school forced by session',['user'=>200,'action'=>'createCourse','data'=>['titulo'=>'Curso da escola','instituicao_id'=>20],'inspect'=>['course'=>'SELECT instituicao_id,escopo FROM curso WHERE id=9']],201,fn($r)=>(int)$r['inspect']['course'][0]['instituicao_id']===10],
    ['Teacher creates for second assigned class',['user'=>100,'action'=>'createCourse','data'=>['titulo'=>'Curso da turma B','turma_id'=>12],'inspect'=>['course'=>'SELECT turma_id,escopo FROM curso WHERE id=9']],201,fn($r)=>(int)$r['inspect']['course'][0]['turma_id']===12],
    ['Teacher cannot target unassigned class',['user'=>100,'action'=>'createCourse','data'=>['titulo'=>'Curso indevido','turma_id'=>21]],403],
    ['Missing teacher class rejected',['user'=>100,'action'=>'createCourse','data'=>['titulo'=>'Sem turma']],422],
    ['Published content can be edited',['user'=>100,'action'=>'saveQuestion','args'=>[3],'data'=>$question],200,fn($r)=>($r['body']['mensagem']??'')==='Pergunta salva'],
    ['Question in own draft can be created',['user'=>100,'action'=>'saveQuestion','args'=>[null],'data'=>$question,'setup'=>['UPDATE curso SET publicado=0 WHERE id=3'],'inspect'=>['questions'=>'SELECT id FROM pergunta_quiz WHERE licao_id=3']],201,fn($r)=>count($r['inspect']['questions'])===2],
    ['Question cannot be added across classes',['user'=>100,'action'=>'saveQuestion','args'=>[null],'data'=>array_replace($question,['licao_id'=>6])],404],
    ['Invalid options rejected',['user'=>100,'action'=>'saveQuestion','args'=>[null],'data'=>array_replace($question,['opcoes'=>[]]),'setup'=>['UPDATE curso SET publicado=0 WHERE id=3']],422],
    ['Negative points rejected',['user'=>100,'action'=>'saveQuestion','args'=>[null],'data'=>array_replace($question,['pontos_recompensa'=>-5]),'setup'=>['UPDATE curso SET publicado=0 WHERE id=3']],422],
    ['Cannot publish empty course',['user'=>300,'action'=>'publish','args'=>[8],'data'=>['publicado'=>true]],422],
    ['Cannot publish module without lessons',['user'=>300,'action'=>'publish','args'=>[8],'data'=>['publicado'=>true],'setup'=>["INSERT INTO modulo (id,curso_id,titulo) VALUES (8,8,'Vazio')"]],422],
    ['Cannot publish lesson without questions',['user'=>300,'action'=>'publish','args'=>[8],'data'=>['publicado'=>true],'setup'=>["INSERT INTO modulo (id,curso_id,titulo) VALUES (8,8,'Vazio')","INSERT INTO licao (id,modulo_id,titulo) VALUES (8,8,'Vazia')"]],422],
    ['Complete draft publishes',['user'=>100,'action'=>'publish','args'=>[3],'data'=>['publicado'=>true],'setup'=>['UPDATE curso SET publicado=0 WHERE id=3'],'inspect'=>['course'=>'SELECT publicado FROM curso WHERE id=3']],200,fn($r)=>(int)$r['inspect']['course'][0]['publicado']===1],
    ['Archive preserves lesson progress',['user'=>100,'action'=>'archive','args'=>['curso',3],'setup'=>["INSERT INTO usuario_licao_progresso VALUES (400,3,'completed',NULL)"],'inspect'=>['progress'=>'SELECT * FROM usuario_licao_progresso','course'=>'SELECT ativo FROM curso WHERE id=3']],200,fn($r)=>count($r['inspect']['progress'])===1 && (int)$r['inspect']['course'][0]['ativo']===0],
    ['Revoked teacher assignment blocks edits',['user'=>100,'action'=>'detail','args'=>[3],'setup'=>['DELETE FROM turma_professor WHERE professor_id=100 AND turma_id=11']],404],
    ['Scoring rejects other class',['mysql'=>true,'user'=>400,'controller'=>'api','action'=>'submitQuiz','args'=>[4],'data'=>['respostas'=>[['pergunta_id'=>4,'opcao_id'=>41]]]],404],
    ['Scoring rejects duplicate question',['mysql'=>true,'user'=>400,'controller'=>'api','action'=>'submitQuiz','args'=>[1],'data'=>['respostas'=>[['pergunta_id'=>1,'opcao_id'=>11],['pergunta_id'=>1,'opcao_id'=>11]]]],422],
    ['Scoring rejects another lesson question',['mysql'=>true,'user'=>400,'controller'=>'api','action'=>'submitQuiz','args'=>[1],'data'=>['respostas'=>[['pergunta_id'=>2,'opcao_id'=>21]]]],422],
    ['Scoring credits once',['mysql'=>true,'user'=>400,'controller'=>'api','action'=>'submitQuiz','args'=>[1],'data'=>['respostas'=>[['pergunta_id'=>1,'opcao_id'=>11]]],'inspect'=>['user'=>'SELECT xp,pontos_totais FROM usuario WHERE id=400']],200,fn($r)=>(int)$r['inspect']['user'][0]['xp']===20 && (int)$r['inspect']['user'][0]['pontos_totais']===5],
    ['Repeated quiz gives no extra points',['mysql'=>true,'user'=>400,'controller'=>'api','action'=>'submitQuiz','args'=>[1],'data'=>['respostas'=>[['pergunta_id'=>1,'opcao_id'=>11]]],'setup'=>["INSERT INTO usuario_licao_progresso VALUES (400,1,'completed',NULL)",'UPDATE usuario SET xp=20,pontos_totais=5 WHERE id=400'],'inspect'=>['user'=>'SELECT xp,pontos_totais FROM usuario WHERE id=400']],200,fn($r)=>$r['body']['xp_ganho']===0 && (int)$r['inspect']['user'][0]['pontos_totais']===5],
];
$failed=0;
foreach($cases as $case) {
    [$name,$input,$status]=$case;$check=$case[3]??null;
    $process=proc_open([PHP_BINARY,__FILE__,'--case',json_encode($input)],[1=>['pipe','w'],2=>['pipe','w']],$pipes);
    $output=stream_get_contents($pipes[1]);$errors=stream_get_contents($pipes[2]);fclose($pipes[1]);fclose($pipes[2]);$exit=proc_close($process);
    $result=json_decode($output,true);$ok=$exit===0 && $errors==='' && ($result['status']??0)===$status && (!$check || $check($result));
    echo ($ok?'PASS ':'FAIL ').$name.PHP_EOL;if(!$ok){$failed++;echo $output.$errors.PHP_EOL;}
}
echo count($cases).' cases, '.$failed.' failures'.PHP_EOL;exit($failed?1:0);

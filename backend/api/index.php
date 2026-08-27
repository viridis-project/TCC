<?php

declare(strict_types=1);

use Viridis\config\Database;
use Viridis\controllers\ApiController;
use Viridis\controllers\AuthController;
use Viridis\controllers\ConviteProfessorController;
use Viridis\controllers\DirectorController;
use Viridis\controllers\OperationalController;
use Viridis\controllers\PartnerController;
use Viridis\controllers\V2Controller;
use Viridis\middleware\AuthMiddleware;

$config = require dirname(__DIR__) . '/config/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

try {
    $db = Database::connection($config);
    $auth = new AuthMiddleware($db);
    $api = new ApiController($db, $auth, $config);
    $ops = new OperationalController($db, $auth);
    $partners = new PartnerController($db, $auth);
    $v2 = new V2Controller($db, $auth);
    $director = new DirectorController($db, $auth);
    $invites = new ConviteProfessorController($db, $auth, $config);
    $authController = new AuthController($db);
    $method = strtoupper($_SERVER['REQUEST_METHOD']);
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '/';
    $path = '/' . trim($path, '/');

    $route = static function (string $expectedMethod, string $pattern, callable $handler) use ($method, $path): bool {
        if ($method !== $expectedMethod || !preg_match($pattern, $path, $matches)) return false;
        array_shift($matches);
        $handler(...array_map(static fn($v) => ctype_digit((string)$v) ? (int)$v : $v, $matches));
        return true;
    };

    if ($route('POST','#^/api/auth/registro$#',[$authController,'registro'])) exit;
    if ($route('POST','#^/api/auth/login$#',[$authController,'login'])) exit;
    if ($route('POST','#^/api/auth/logout$#',[$authController,'logout'])) exit;
    if ($route('GET','#^/api/convites-professor/([a-f0-9]{64})$#',[$invites,'detail'])) exit;
    if ($route('POST','#^/api/convites-professor/([a-f0-9]{64})/aceitar$#',[$invites,'accept'])) exit;
    if ($route('GET','#^/api/perfil$#',fn()=>$api->perfil('GET'))) exit;
    if ($route('PUT','#^/api/perfil$#',fn()=>$api->perfil('PUT'))) exit;
    if ($route('GET','#^/api/modulos$#',[$api,'modulos'])) exit;
    if ($route('GET','#^/api/licoes/(\d+)/quiz$#',[$api,'quiz'])) exit;
    if ($route('POST','#^/api/licoes/(\d+)/quiz/submeter$#',[$api,'submitQuiz'])) exit;
    if ($route('GET','#^/api/missoes$#',[$api,'missoes'])) exit;
    if ($route('POST','#^/api/submissoes$#',[$api,'createSubmission'])) exit;
    if ($route('GET','#^/api/submissoes$#',[$api,'submissions'])) exit;
    if ($route('PUT','#^/api/submissoes/(\d+)/revisar$#',[$api,'reviewSubmission'])) exit;
    if ($route('GET','#^/api/recompensas$#',[$api,'rewards'])) exit;
    if ($route('POST','#^/api/resgates$#',[$api,'redeem'])) exit;
    if ($route('GET','#^/api/ranking$#',[$api,'ranking'])) exit;
    if ($route('GET','#^/api/parceiros(?:/(\d+))?$#',fn($id=null)=>$partners->handle('GET',$id))) exit;
    if ($route('POST','#^/api/parceiros$#',fn()=>$partners->handle('POST',null))) exit;
    if ($route('PUT','#^/api/parceiros/(\d+)$#',fn($id)=>$partners->handle('PUT',$id))) exit;
    if ($route('DELETE','#^/api/parceiros/(\d+)$#',fn($id)=>$partners->handle('DELETE',$id))) exit;
    if ($route('GET','#^/api/cronograma$#',fn()=>$ops->schedule('GET',null))) exit;
    if ($route('POST','#^/api/cronograma$#',fn()=>$ops->schedule('POST',null))) exit;
    if ($route('PUT','#^/api/cronograma/(\d+)$#',fn($id)=>$ops->schedule('PUT',$id))) exit;
    if ($route('DELETE','#^/api/cronograma/(\d+)$#',fn($id)=>$ops->schedule('DELETE',$id))) exit;
    if ($route('GET','#^/api/admin/dashboard$#',[$ops,'dashboard'])) exit;
    if ($route('GET','#^/api/jardim/resumo$#',[$ops,'garden'])) exit;
    if ($route('GET','#^/api/certificados$#',[$ops,'certificates'])) exit;
    if ($route('GET','#^/api/notificacoes/contagem-nao-lidas$#',fn()=>$v2->notifications('count'))) exit;
    if ($route('GET','#^/api/notificacoes$#',fn()=>$v2->notifications('list'))) exit;
    if ($route('PUT','#^/api/notificacoes/marcar-todas-lidas$#',fn()=>$v2->notifications('all'))) exit;
    if ($route('PUT','#^/api/notificacoes/(\d+)/marcar-lida$#',fn($id)=>$v2->notifications('one',$id))) exit;
    if ($route('GET','#^/api/agenda/aluno$#',[$v2,'studentAgenda'])) exit;
    if ($route('GET','#^/api/agenda/professor$#',[$v2,'teacherAgenda'])) exit;
    if ($route('POST','#^/api/agenda$#',[$v2,'createAgenda'])) exit;
    if ($route('PUT','#^/api/agenda/(\d+)/status$#',[$v2,'agendaStatus'])) exit;
    if ($route('GET','#^/api/admin/quiz/perguntas$#',[$v2,'quizQuestions'])) exit;
    if ($route('POST','#^/api/admin/quiz/perguntas$#',fn()=>$v2->saveQuestion(null))) exit;
    if ($route('PUT','#^/api/admin/quiz/perguntas/(\d+)$#',[$v2,'saveQuestion'])) exit;
    if ($route('DELETE','#^/api/admin/quiz/perguntas/(\d+)$#',[$v2,'deleteQuestion'])) exit;
    if ($route('GET','#^/api/diretor/dashboard$#',[$v2,'directorDashboard'])) exit;
    if ($route('GET','#^/api/diretor/turmas$#',fn()=>$director->classes('GET'))) exit;
    if ($route('POST','#^/api/diretor/turmas$#',fn()=>$director->classes('POST'))) exit;
    if ($route('GET','#^/api/diretor/turmas/(\d+)$#',[$director,'detail'])) exit;
    if ($route('PUT','#^/api/diretor/turmas/(\d+)$#',[$director,'update'])) exit;
    if ($route('DELETE','#^/api/diretor/turmas/(\d+)$#',[$director,'deleteClass'])) exit;
    if ($route('POST','#^/api/diretor/turmas/(\d+)/regenerar-codigo$#',[$director,'regenerateCode'])) exit;
    if ($route('GET','#^/api/diretor/turmas/(\d+)/alunos$#',[$director,'students'])) exit;
    if ($route('PUT','#^/api/diretor/turmas/(\d+)/alunos/(\d+)$#',[$director,'moveStudent'])) exit;
    if ($route('DELETE','#^/api/diretor/turmas/(\d+)/alunos/(\d+)$#',[$director,'unlinkStudent'])) exit;
    if ($route('GET','#^/api/diretor/professores-disponiveis$#',[$v2,'availableTeachers'])) exit;
    if ($route('POST','#^/api/diretor/turmas/(\d+)/professores$#',fn($tid)=>$director->classTeacher($tid,null,'POST'))) exit;
    if ($route('DELETE','#^/api/diretor/turmas/(\d+)/professores/(\d+)$#',fn($tid,$pid)=>$director->classTeacher($tid,$pid,'DELETE'))) exit;
    if ($route('GET','#^/api/diretor/convites-professor$#',[$invites,'list'])) exit;
    if ($route('POST','#^/api/diretor/convites-professor$#',[$invites,'create'])) exit;
    if ($route('DELETE','#^/api/diretor/convites-professor/(\d+)$#',[$invites,'cancel'])) exit;
    if ($route('GET','#^/api/admin/recompensas$#',fn()=>$v2->managedRewards('app','GET'))) exit;
    if ($route('POST','#^/api/admin/recompensas$#',fn()=>$v2->managedRewards('app','POST'))) exit;
    if ($route('PUT','#^/api/admin/recompensas/(\d+)$#',fn($id)=>$v2->managedRewards('app','PUT',$id))) exit;
    if ($route('DELETE','#^/api/admin/recompensas/(\d+)$#',fn($id)=>$v2->managedRewards('app','DELETE',$id))) exit;
    if ($route('GET','#^/api/diretor/recompensas$#',fn()=>$v2->managedRewards('escola','GET'))) exit;
    if ($route('POST','#^/api/diretor/recompensas$#',fn()=>$v2->managedRewards('escola','POST'))) exit;
    if ($route('PUT','#^/api/diretor/recompensas/(\d+)$#',fn($id)=>$v2->managedRewards('escola','PUT',$id))) exit;
    if ($route('DELETE','#^/api/diretor/recompensas/(\d+)$#',fn($id)=>$v2->managedRewards('escola','DELETE',$id))) exit;

    http_response_code(404);
    echo json_encode(['erro'=>'Rota não encontrada'],JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(500);
    $payload=['erro'=>'Não foi possível concluir a operação'];
    if (!empty($config['debug'])) $payload['detalhe']=$e->getMessage();
    echo json_encode($payload,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);
}

<?php
declare(strict_types=1);

// ── Configuration ──────────────────────────────────────────────
define('DESTINATAIRE', 'contact@mygreenevent.fr');
define('SITE_URL',     'https://mygreenevent.fr');

// ── Helpers ────────────────────────────────────────────────────
function clean(string $val): string {
    return htmlspecialchars(strip_tags(trim($val)), ENT_QUOTES, 'UTF-8');
}

function redirect(string $status): never {
    header('Location: ' . SITE_URL . '/contact.html?statut=' . $status);
    exit;
}

// ── Vérifications de base ───────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirect('erreur');
}

// Anti-spam honeypot (champ caché, un bot le remplirait)
if (!empty($_POST['website'])) {
    redirect('erreur');
}

// ── Récupération et validation des champs ───────────────────────
$nom       = clean($_POST['nom']       ?? '');
$email     = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$telephone = clean($_POST['telephone'] ?? '');
$objet     = clean($_POST['objet']     ?? '');
$decouverte= clean($_POST['decouverte']?? '');
$message   = clean($_POST['message']   ?? '');

if (!$nom || !$email || !$telephone || !$objet || !$message) {
    redirect('erreur');
}

$objets_valides = ['Devis', 'Partenariat', 'Stage', 'Autre'];
if (!in_array($objet, $objets_valides, true)) {
    redirect('erreur');
}

// ── Construction du mail ────────────────────────────────────────
$sujet = '=?UTF-8?B?' . base64_encode('[MGE] ' . $objet . ' — ' . $nom) . '?=';

$corps = "Nouveau message reçu via le formulaire de contact My Green Event\n";
$corps .= str_repeat('─', 60) . "\n\n";
$corps .= "Nom         : $nom\n";
$corps .= "Email       : $email\n";
$corps .= "Téléphone   : $telephone\n";
$corps .= "Objet       : $objet\n";
if ($decouverte) {
    $corps .= "Découverte  : $decouverte\n";
}
$corps .= "\nMessage :\n" . str_repeat('─', 40) . "\n";
$corps .= wordwrap($message, 75, "\n", false) . "\n\n";
$corps .= str_repeat('─', 60) . "\n";
$corps .= "Envoyé le " . date('d/m/Y à H:i') . " depuis mygreenevent.fr\n";

$entetes  = "From: My Green Event <noreply@mygreenevent.fr>\r\n";
$entetes .= "Reply-To: $nom <$email>\r\n";
$entetes .= "Content-Type: text/plain; charset=UTF-8\r\n";
$entetes .= "Content-Transfer-Encoding: 8bit\r\n";
$entetes .= "X-Mailer: PHP/" . phpversion() . "\r\n";

// ── Envoi ───────────────────────────────────────────────────────
$envoye = mail(DESTINATAIRE, $sujet, $corps, $entetes);

// ── Email de confirmation à l'expéditeur ────────────────────────
if ($envoye) {
    $sujet_confirm = '=?UTF-8?B?' . base64_encode('Votre message a bien été reçu — My Green Event') . '?=';
    $corps_confirm  = "Bonjour $nom,\n\n";
    $corps_confirm .= "Merci pour votre message ! Je l'ai bien reçu et vous répondrai sous 48h.\n\n";
    $corps_confirm .= "Voici un récapitulatif de votre demande :\n";
    $corps_confirm .= str_repeat('─', 40) . "\n";
    $corps_confirm .= "Objet     : $objet\n";
    $corps_confirm .= "Message   : $message\n";
    $corps_confirm .= str_repeat('─', 40) . "\n\n";
    $corps_confirm .= "À très bientôt,\n";
    $corps_confirm .= "Coralie — My Green Event\n";
    $corps_confirm .= "contact@mygreenevent.fr · 06 22 14 61 85\n";
    $corps_confirm .= SITE_URL . "\n";

    $entetes_confirm  = "From: Coralie — My Green Event <contact@mygreenevent.fr>\r\n";
    $entetes_confirm .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $entetes_confirm .= "Content-Transfer-Encoding: 8bit\r\n";

    mail($email, $sujet_confirm, $corps_confirm, $entetes_confirm);
}

redirect($envoye ? 'ok' : 'erreur');

/**
 * Traduit une panne technique en phrase utile pour le gérant.
 *
 * Il ne peut rien faire de « GitHub 401 sur /repos/… » : ce qui lui importe,
 * c'est de savoir si sa modification est passée, et qui prévenir sinon. Le
 * détail technique part dans les journaux du serveur.
 */
export function messageOperateur(erreur: unknown): string {
  const texte = `${erreur}`;
  console.error('[admin]', texte);

  if (texte.includes("n'est pas configuré")) {
    return "L’enregistrement n’est pas encore activé sur ce site. Préviens ton développeur.";
  }
  if (texte.includes('GitHub 401') || texte.includes('GitHub 403')) {
    return "L’accès au site a expiré. Préviens ton développeur : la clé d’enregistrement doit être renouvelée.";
  }
  if (texte.includes('GitHub 404')) {
    return "Le site n’a pas été retrouvé. Préviens ton développeur.";
  }
  if (texte.includes('GitHub 409') || texte.includes('GitHub 422')) {
    return 'Une autre modification vient d’être enregistrée. Recharge la page et recommence.';
  }
  return 'L’enregistrement a échoué. Réessaie dans un instant ; si ça persiste, préviens ton développeur.';
}

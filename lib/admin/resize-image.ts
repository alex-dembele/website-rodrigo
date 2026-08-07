/**
 * Réduit une photo dans le navigateur avant de l'envoyer.
 *
 * Les photos de téléphone pèsent plusieurs mégaoctets : les envoyer telles
 * quelles serait long sur une connexion mobile et alourdirait le site pour
 * tous les visiteurs. On les ramène ici à 1400 px, comme le fait le script
 * de préparation des photos.
 */
const TAILLE_MAX = 1400;
const QUALITE = 0.85;

export interface PhotoPreparee {
  /** Aperçu affichable immédiatement dans le formulaire. */
  preview: string;
  /** Contenu JPEG encodé, envoyé au serveur. */
  base64: string;
  poidsKo: number;
}

export async function preparePhoto(file: File): Promise<PhotoPreparee> {
  const bitmap = await createImageBitmap(file);
  const ratio = Math.min(1, TAILLE_MAX / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * ratio);
  const height = Math.round(bitmap.height * ratio);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Impossible de préparer la photo sur cet appareil.');
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const dataUrl = canvas.toDataURL('image/jpeg', QUALITE);
  const base64 = dataUrl.split(',')[1];
  return {
    preview: dataUrl,
    base64,
    poidsKo: Math.round((base64.length * 0.75) / 1024)
  };
}

// assets/js/map/config.js

export const SCRIPT_VERSION = 'v5';

// Clé d’upload + clé de session
export let UPLOAD_KEY = localStorage.getItem('UPLOAD_KEY')
  || new URLSearchParams(location.search).get('key');
if (UPLOAD_KEY) localStorage.setItem('UPLOAD_KEY', UPLOAD_KEY);
export const LOCATION_KEY = UPLOAD_KEY;

// Date de départ du roadtrip
export const START_DATE = new Date(2025, 7, 2);

// Villages classés « Plus Beaux de France »
export const plusBeaux = [
  'Salers','Collonges-la-Rouge','Saint-Cirq-Lapopie','Cordes-sur-Ciel',
  'La Couvertoirade','Gordes','Moustiers-Sainte-Marie','Pérouges','Semur-en-Auxois','Lautrec'
];

// Liste principale des villes / étapes
export const cities = [
  { name:'Paris', coords:[48.824512,2.365747], description:'Paname !.' },
  { name:'Apremont-sur-Allier', coords:[46.8644,3.0178], description:'Classé parmi les Plus Beaux Villages de France, Apremont-sur-Allier charme par son château, ses maisons fleuries en pierre blanche et son parc floral exceptionnel en bord de rivière.' },
  { name:'Salers', coords:[45.0571,2.5872], description:'Joyau du Cantal, ce village médiéval est célèbre pour ses bâtisses en pierre volcanique sombre, ses tourelles, et bien sûr, son fromage AOP Salers au caractère affirmé.' },
  { name:'Saint-Cirq-Lapopie', coords:[44.4642,1.6719], description:'Accroché à une falaise dominant la vallée du Lot, ce village pittoresque est un chef-d’œuvre médiéval aux ruelles pavées et aux maisons à colombages parfaitement conservées.' },
  { name:'Cordes-sur-Ciel', coords:[44.0639,1.9556], description:'Perle gothique du Tarn, cette cité médiévale offre un panorama céleste et des ruelles escarpées abritant galeries d’art et artisans d’exception.' },
  { name:'Salles-sur-Garonne', coords:[43.2006,1.1819], description:'Charmant village familial niché en Haute-Garonne, idéal pour se ressourcer au bord de la Garonne entre bois, nature et authenticité occitane.' },
  { name:'Lautrec', coords:[43.705,2.1381], description:'Village médiéval du Tarn, réputé pour son ail rose AOP, son moulin à vent restauré et sa vue panoramique sur la vallée de l’Agoût.' },
  { name:'La Couvertoirade', coords:[43.9139,3.3164], description:'Ancienne commanderie templière, ce village fortifié du Larzac plonge les visiteurs dans l’histoire avec ses remparts, échoppes d’artisans et ruelles pavées.' },
  { name:'Gordes', coords:[43.912,5.2], description:'Suspendu sur un rocher, ce village du Luberon enchante avec ses maisons en pierre sèche, ses panoramas provençaux et son abbaye de Sénanque voisine bordée de lavande.' },
  { name:'Moustiers-Sainte-Marie', coords:[43.8433,6.2225], description:'Niché entre deux falaises, ce village est célèbre pour sa faïence artisanale, son étoile suspendue mystérieuse et sa proximité avec les gorges du Verdon.' },
  { name:'Nice', coords:[43.7102,7.262], description:'Capitale de la Côte d’Azur, Nice allie plages ensoleillées, vieille ville colorée, marchés animés, musées, et une Promenade des Anglais mythique.' },
  { name:'Sisteron', coords:[44.1956,5.9469], description:'Surnommée la “Porte de la Provence”, cette ville est dominée par une citadelle spectaculaire et bordée par la Durance dans un décor de montagnes majestueuses.' },
  { name:'Montélimar', coords:[44.5584,4.7509], description:'Connue comme la capitale du nougat, Montélimar est aussi une ville paisible et fleurie, avec de beaux hôtels particuliers et un château surplombant le centre.' },
  { name:'Pérouges', coords:[45.975,5.1236], description:'Cité médiévale parfaitement conservée, perchée sur une colline, connue pour sa galette au sucre et ses ruelles en galets qui sentent bon le Moyen Âge.' },
  { name:'Annemasse', coords:[46.1944,6.2378], description:'Ville carrefour entre la France et Genève, idéale pour une pause entre montagnes, lacs et balades alpines, avec toutes les commodités urbaines à portée.' },
  { name:'Semur-en-Auxois', coords:[47.4376,4.2607], description:'Superbe cité médiévale de Bourgogne entourée de remparts, avec ses tours imposantes, son pont pittoresque et ses maisons à pans de bois colorées.' },
  { name:'Paris', coords:[48.824512,2.365747], description:"Au fond, j'crois qu'la Terre est ronde,Pour une seule bonne raison,Après avoir fait l'tour du monde,Tout c'qu'on veut, c'est être à la maison" }
];

// Nuitées / type d’hébergement
export const lodging = {
  'Apremont-sur-Allier':'1 nuit',
  'Salers':'1 nuit',
  'Collonges-la-Rouge':'1 nuit',
  'Saint-Cirq-Lapopie':'traversée',
  'Cordes-sur-Ciel':'1 nuit',
  'Salles-sur-Garonne':'4 nuits',
  "Lautrec":'traversée',
  'La Couvertoirade':'1 nuit',
  'Gordes':'1 nuit',
  'Moustiers-Sainte-Marie':'traversée',
  'Nice':'2 nuits',
  'Sisteron':'1 nuit',
  'Montélimar':'2 nuits',
  'Pérouges':'1 nuit',
  'Annemasse':'2 nuits',
  'Semur-en-Auxois':'1 nuit'
};
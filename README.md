 # KS - Projekt im Rahmen von Prof. Dr. Udo Mueller

Kommunikationssysteme – Entwicklung Prototyp

Inhalt

1.	Betrance	
2.	Architektur	
3.	Server	
3.1.	Hosting	
3.2.	Anwendungsserver	
3.2.1.	NODE.JS	
3.2.2.	EXPRESS.JS	
4.	Datenbank	
4.1.	MongoDB	
4.2.	Mongoose	
4.2.1.	Models	
4.2.1.1.	Beacons	
4.2.1.2.	Networks	
4.2.1.3.	Users	
5.	Client	
5.1.	Browser	
5.1.1.	Pencil Project	
5.1.2.	Prototyp	
5.1.3.	AngularJS	
5.1.3.1.	Routing	
5.1.3.2.	REST-API	
5.1.3.3.	Authentifizierung	

1.	Betrance – Idee 

Die Idee von betrance basiert auf iBeacons. iBeacons sind einfache Bluetooth Sender, mit diesen man z.B. standortabhängige Funktionen freischalten kann. Kombiniert man diese mit einer Smartphone App und einer Webanwendung, können sehr gute und interessante Systeme erstehen. 

Im Rahmen dieses Projekts haben wir uns für einen Bewegungsprofilersteller entschieden, mit welchem es möglich sein soll, anhand der iBeacons und der App die Laufwege einer Person aufzuzeigen. Unser System basiert auf Benutzern, Netzwerken und iBeacons.
 
Ein Netzwerk ist immer eindeutig und kann keinen oder mehrere iBeacons beinhalten. Ein Benutzer kann vorerst keinem oder mehreren Netzwerken hinzugefügt werden. Ist ein Benutzer in einem Netzwerk, dann kann er auch die Bewegungen in einem Netzwerk verfolgen. 

Unser Ziel war es daher, den kompletten Aufbau einer Webanwendung in Kombination mit einer App kennenzulernen und 100% zu verstehen. Zudem wollten wir nicht nur eine simple App entwickeln, sondern diese mit dem realen Leben in Verbindung bringen (iBeacons), um später effiziente, sichere  und gute Systeme entwickeln zu können. 


2.	Architektur 

3.	Server
3.1.	 Hosting
Das zuvor definierte Ziel war es, einen selbst aufgesetzten Linux - Server im Internet bereit zu Stellen. Dafür haben wir eine virtuelle Linux-Maschine aufgesetzt und versucht über DynDNS (das die public-IP alle 24h wechselt) und Port Forwarding diese zu adressieren. Allerdings stellt uns unser Internetanbieter (Kabel BW) nur eine IPv4 Adresse zur Verfügung, die nur innerhalb eines kleinen Subnetzes eindeutig ist. Dadurch konnten wir nicht unseren eigenen Webserver im Internet zur Verfügung stellen (was ziemlich cool gewesen wäre  )!  
Aus Interesse haben wir uns analog dazu auf der Internetseite des BSI darüber informiert, welche Sicherheitsaspekte man bei einem eigenen Server im Internet beachten muss.
Als Alternative dazu haben wir uns dann bei 1&1 einen virtuellen Server (incl. Domain betrance.de) zu Studententarifen gemietet. Darauf konnte Sven Jaschkewitz dann Debian, NodeJS, MongoDB und den Befehlt forever installieren. Nach ein paar weiteren Konfigurationen, war dann eine schlichte Startseite unter der Domain betrance.de und über den Port 80 erreichbar. 
3.2.	Anwendungsserver
Da wir von Beginn an wussten, dass unser System im Wesentlichen auf einer App basiert, haben wir uns für den MEAN-Stack als Technologie entschieden.
3.2.1.	NODE.JS
Unser Anwendungsserver wurde mittels Node.JS implementiert. Dies hat mehrere Vorteile: 
-	Schnelligkeit
-	Asynchronität
-	Alles JSON (keine unnötige Konvertierung)
3.2.2.	EXPRESS.JS
Mit dem Modul express.js habe ich daraufhin die REST-API umgesetzt und implementiert, d.h. http-Request und die zugehörigen http-Responses definiert und festgelegt. 
Beispiel: 
app.get("/beacons/:id", function(req, res){
    mongoose.model('beacons').findById(req.params.id, function (err, beacon) {
        res.json(beacon);
    });
});

Dadurch werden die Ressourcen zentral auf dem Anwendungsserver verwaltet und bearbeitet. Dies hat zur Folge, dass die Ressourcen von jedem beliebigen Client genutzt werden können und somit ein Großteil der Clientseitigen-Anwendungslogik auf dem Server für alle Clients nur einmal programmiert werden muss (Datei: server.js).  
4.	Datenbank
4.1.	 MongoDB
Wenn man auf Basis des MEAN-Stack entwickelt, ist es der natürliche Weg eine MongoDB zu verwenden, solange die Komplexität an Beziehungen überschaubar ist. Ansonsten werden die Vorteile der MongoDB schnell verbraucht und man muss sich über Alternativen, wie z.B. die unter kommerziellen Nutzung lizenzfreie PostgreSQL-Datenbank Gedanken zu machen. Für die Entwicklung habe ich beide Datenbanken lokal auf meinem Rechner eingerichtet, um beide zu testen. 
4.2.	 Mongoose
Damit die Verbindung zwischen der MongoDB und unserem Anwendungsserver funktioniert, habe ich das Modul Mongoose verwendet. Dabei definiert man sogenannte Models, welche Collections (vergleichbar mit Tabellen in einem relationalen Datenbankschema) in der MongoDB wiederspiegeln. 
4.2.1.	Models
4.2.1.1.	Beacons
Ein Beacon besitzt hier folgende Attribute: 
-	name
-	description
-	network 
In der Datenbank wird jeder Datensatz um eine eindeutige ObjectId ergänzt, die im weiteren Verlauf als Primärschlüssel verwendet werden kann. 
{
        "_id" : ObjectId("555b50d31ab61bd2b764c042"),
        "name" : "Küche",
        "description" : "Beacon in der Küche",
        "network" : "WG KA SVANSI"
}

/**
 * Created by Andreas on 30.04.2015.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var beaconsSchema = new Schema({
    name: String,
    description: String,
    network: String
});

module.export = mongoose.model('beacons', beaconsSchema);

4.2.1.2.	Networks
/**
 * Created by Andreas on 30.04.2015.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var networksSchema = Schema({
    name: String,
    description: String,
    img: String,
    beacons: Array
});

module.export = mongoose.model('networks', networksSchema);

4.2.1.3.	Users 
/**
 * Created by Andreas on 30.04.2015.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usersSchema = new Schema({
    username: String,
    email: String,
    password: String,
    networks: []

});

module.exports = mongoose.model('users', usersSchema);

5.	Client
Der Benutzer unserer Anwendung sollte über diverse Clients auf unsere Anwendung zugreifen können. Dafür haben wir die Anwendung für zwei Clients, Browser und Smartphone, entwickelt. 
5.1.	 Browser
Bereits im Vorfeld der Entwicklung habe ich mir Gedanken darüber gemacht, welche Informationen dem Benutzer wie aufbereitet werden sollen und die Benutzernavigation mittels eines Sequenzdiagramms festgelegt. 
5.1.1.	Pencil Project 
Der nächste Schritt bestand darin einen durchklickbaren Prototyp mittels Pencil Project zu erstellen, da dies um einiges schneller und übersichtlicher funktioniert, als gleich von Beginn an einen Prototyp mit HTML zu erstellen. 
5.1.2.	Prototyp
Nach dem der Prototyp in Pencil Project stand und ich von meinem Teampartner Sven die Zustimmung bekam, diesen so umzusetzen, habe ich mit HTML, CSS und JavaScript damit begonnen. 
5.1.3.	AngularJS
Um diesen Prototyp nun mit etwas leben zu befüllen, habe ich AngularJS verwendet, um auf die Daten unserer REST-API zuzugreifen und die Anwendung dadurch dynamisch zu gestalten. 
Begonnen habe ich dabei mit dem Routing.
5.1.3.1.	Routing
Dazu habe ich das zusätzliche Modul „angular-new-router“ mit eingebunden. 
function AppController($router) {
    $router.config([
        { path: "/beacons",             component: "beacons"      },
        { path: "/charts",              component: "charts"       },
        { path: "/friends",             component: "friends"      },
        { path: "/networks",            component: "networks"     },
        { path: "/news",                component: "news"         },
        { path: "/settings",            component: "settings"     },
        { path: "/",                    component: "welcome"      }
    ]);
}
Damit können nun bestimmte Routen auf feste Komponenten gemappt werden. Diese Komponenten finden Sie in dem Verzeichnis Components. 

5.1.3.2.	REST-API
Damit die Anwendungen nun noch wie gedacht benutzt werden kann, musste noch ein Zugriff auf die REST-API hinzugefügt werden. Diesen habe ich mittels verschiedenen Services und $ressource gelöst. (Datei: services.js)

5.1.3.3.	Authentifizierung 
Um die Anwendung für Benutzer zugänglich zu machen, musste ich mir über die verschiedenen Wege der Authentifizierung Gedanken machen. Da ein User gleichzeitig mit mehreren Clients auf unseren Server zugreifen können muss, konnte hierbei nicht nur auf eine simple Session zurückgegriffen werden. 
Diese habe ich zuvor durch das Modul express-session verwendet. Der Benutzer hat dabei in das Dialogfenster seinen Benutzernamen oder seine Email-Adresse eingetragen und zusätzlich sein Passwort und diese Daten beim Klick auf den Login Button, mittels http POST-Request an den Server gesendet. Die Daten wurden dann auf der Server-Seite validiert und je nach Ergebnis, wurde eine Benutzersession gestartet, oder der Benutzer wurde zum erneuten Login aufgefordert. Über den Button Logout konnte der Benutzer seine Session wieder beenden. 
Nach genauerer Recherche kam ich darauf, dass die Authentifizierung mittels eines Tokens und Cookies umgesetzt werden muss. Nachdem ich mir die Theorie dahinter angeschaut habe, und versucht habe diesen mit dem Modul jsonwebtoken umzusetzen, konnte ich leider aus zeitlichen Gründen die Implementierung nicht vollständig umsetzten. 
Daher hat die Anwendung momentan leider noch keinen komplett funktionstüchtigen Login. 

6.	Aufwand – Zeit

Der Aufwand entspricht dabei auch dem gelernten und dem Mehrwert dem Projekt! 

Aufwand	Zeit
Server	
Hosting	
-	Eigenen Linux Server				3h
-	DynDNS	2h
-	Port Forwarding	2h
-	1&1 Virtual Machine 				3h
MongoDB	
-	Collections festlegen				2h
-	JSON Attribute festlegen			1h
NodeJS	
-	Server implementieren				1h
-	Express.js REST-API					20h
-	Express.js Session					10h
Mongoose	
-	Datenbankanbindung					5h
-	Models definiert 					2h
	
Client 	
Pencil Project 	
-	Sequenzdiagramm 					1h
-	Prototyp							5h
Webanwendung 	
-	Klickbarer Prototyp					20h
-	Routing angular-new-route			10h
-	AngularJS implementieren 			10h
-	Services für REST-API einbinden 	10h
-	Authentifizierung 					20h

SUMME AUFWAND-ZEIT 						127h 

7.	Github 
7.1.	Sven Jaschkewitz
7.2.	Andreas Foitzik 









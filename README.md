 # KS - Projekt im Rahmen von Prof. Dr. Udo Mueller
 

Kommunikationssysteme – Entwicklung Prototyp

Inhalt
Kommunikationssysteme – Entwicklung Prototyp	
1.	Betrance – Idee	
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
6.	Android App	
6.1 Android Beacon Library	
6.2 Aufbau	
6.3 Res-Drawable	
6.4 Res-Layout	
6.5 Res-Menu	
6.6 Res-Values	
6.7 Res-XML	
7.	Aufwand – Zeit	
Aufwand	
Zeit	
Server	
Client	
8.	Github	
8.1.	Sven Jaschkewitz	
8.2.	Andreas Foitzik	


1.	Betrance – Idee 

Die Idee von betrance basiert auf iBeacons. iBeacons sind einfache Bluetooth Sender, mit diesen man z.B. standortabhängige Funktionen freischalten kann. Kombiniert man diese mit einer Smartphone App und einer Webanwendung, können sehr gute und interessante Systeme entstehen. 

Im Rahmen dieses Projekts haben wir uns für einen Bewegungsprofilersteller entschieden, mit welchem es möglich sein soll, anhand der iBeacons und der App die Laufwege einer Person aufzuzeigen. Unser System basiert auf drei verschiedenen Objekten Benutzern, Netzwerken und iBeacons.
 
Ein Netzwerk ist immer eindeutig und kann keinen oder mehrere iBeacons beinhalten. Ein Benutzer kann vorerst keinem oder mehreren Netzwerken hinzugefügt werden. Ist ein Benutzer in einem Netzwerk, dann kann er auch die Bewegungen in einem Netzwerk verfolgen. 

Unser Ziel war es daher, den kompletten Aufbau einer Webanwendung in Kombination mit einer App kennenzulernen und 100% zu verstehen. Zudem wollten wir nicht nur eine simple App entwickeln, sondern diese mit dem realen Leben in Verbindung bringen (iBeacons), um später effiziente, sichere  und gute Systeme entwickeln zu können. 


2.	Architektur 


3.	Server
3.1.	 Hosting
Das zuvor definierte Ziel war es, einen selbst aufgesetzten Linux - Server im Internet bereit zu Stellen. Dafür haben wir eine virtuelle Linux-Maschine aufgesetzt und versucht über DynDNS (da die Public-IP alle 24h wechselt) und Port Forwarding diese zu adressieren. Allerdings stellt uns unser Internetanbieter (Kabel BW) nur eine IPv4 Adresse zur Verfügung, die nur innerhalb eines kleinen Subnetzes eindeutig ist. Dadurch konnten wir nicht unseren eigenen Webserver im Internet zur Verfügung stellen (was ziemlich cool gewesen wäre  )!  
Aus Interesse haben wir uns analog dazu auf der Internetseite des BSI darüber informiert, welche Sicherheitsaspekte man bei einem eigenen Server im Internet beachten muss.
Als Alternative dazu haben wir uns dann bei 1&1 einen virtuellen Server (incl. Domain betrance.de) zu Studententarifen gemietet. Darauf konnten wir dann Ubuntu, NodeJS, MongoDB, npm, nvm und forever installieren. Nach ein paar weiteren Konfigurationen, war dann eine schlichte Startseite unter der Domain betrance.de und über den Port 80 erreichbar. Für die Konfiguration des Servers wurde zusätzlich ein Tutorial erstellt.
3.2.	Anwendungsserver
Da wir von Beginn an wussten, dass unser System im Wesentlichen auf einer App basiert, haben wir uns für den MEAN-Stack als Technologie entschieden.
3.2.1.	NODE.JS
Unser Anwendungsserver wurde mittels Node.JS implementiert. Dies hat mehrere Vorteile: 
-	Schnelligkeit
-	Asynchronität
-	Alles JSON (keine unnötige Konvertierung)
3.2.2.	EXPRESS.JS
Mit dem Modul express.js wurde daraufhin die REST-API umgesetzt und implementiert, d.h. http-Request und die zugehörigen http-Responses definiert und festgelegt. 
Beispiel: 
app.get("/beacons/:id", function(req, res){
    mongoose.model('beacons').findById(req.params.id, function (err, beacon) {
        res.json(beacon);
    });
});

Dadurch werden die Ressourcen zentral auf dem Anwendungsserver verwaltet und bearbeitet. Dies hat zur Folge, dass die Ressourcen von jedem beliebigen Client genutzt werden können und somit ein Großteil der Clientseitigen-Anwendungslogik auf dem Server für alle Clients nur einmal programmiert werden muss (Datei: server.js).  
4.	Datenbank
4.1.	 MongoDB
Wenn man auf Basis des MEAN-Stack entwickelt, ist es der natürliche Weg eine MongoDB zu verwenden, solange die Komplexität an Beziehungen überschaubar ist. Ansonsten werden die Vorteile der MongoDB schnell verbraucht und man muss sich über Alternativen, wie z.B. die unter kommerziellen Nutzung lizenzfreie PostgreSQL-Datenbank Gedanken zu machen. Für die Entwicklung haben wir beide Datenbanken lokal auf einen Rechner eingerichtet, um beide zu testen. 
4.2.	 Mongoose
Damit die Verbindung zwischen der MongoDB und unserem Anwendungsserver funktioniert, wurde das Modul Mongoose verwendet. Dabei definiert man sogenannte Models, welche Collections (vergleichbar mit Tabellen in einem relationalen Datenbankschema) in der MongoDB wiederspiegeln. 
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
Bereits im Vorfeld der Entwicklung haben wir uns Gedanken darüber gemacht, welche Informationen dem Benutzer wie aufbereitet werden sollen und die Benutzernavigation mittels eines Sequenzdiagramms festgelegt. 
5.1.1.	Pencil Project 
Der nächste Schritt bestand darin einen durchklickbaren Prototyp mittels Pencil Project zu erstellen, da dies um einiges schneller und übersichtlicher funktioniert, als gleich von Beginn an einen Prototyp mit HTML zu erstellen. 
5.1.2.	Prototyp
Nach dem der Prototyp in Pencil Project stand und wir uns auf ein Design geeinigt haben. Haben wir mit HTML, CSS und JavaScript begonnen. 
5.1.3.	AngularJS
Um diesen Prototyp nun mit etwas leben zu befüllen, wurde AngularJS verwendet, um auf die Daten unserer REST-API zuzugreifen und die Anwendung dadurch dynamisch zu gestalten. 
Begonnen wurde dabei mit Routing.
5.1.3.1.	Routing
Dazu wurde das zusätzliche Modul „angular-new-router“ mit eingebunden. 
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
Damit die Anwendungen nun doch wie gedacht benutzt werden kann, musste noch ein Zugriff auf die REST-API hinzugefügt werden. Dieser wurde mittels verschiedener Services und $ressource gelöst. (Datei: services.js)


5.1.3.3.	Authentifizierung 
Um die Anwendung für Benutzer zugänglich zu machen, mussten wir uns über die verschiedenen Wege der Authentifizierung Gedanken machen. Da ein User gleichzeitig mit mehreren Clients auf unseren Server zugreifen können muss, konnte hierbei nicht nur auf eine simple Session zurückgegriffen werden. 
Diese wurde zuvor durch das Modul express-session verwendet. Der Benutzer hat dabei in das Dialogfenster seinen Benutzernamen oder seine Email-Adresse eingetragen und zusätzlich sein Passwort und diese Daten beim Klick auf den Login Button, mittels http POST-Request an den Server gesendet. Die Daten wurden dann auf der Server-Seite validiert und je nach Ergebnis, wurde eine Benutzersession gestartet, oder der Benutzer wurde zum erneuten Login aufgefordert. Über den Button Logout konnte der Benutzer seine Session wieder beenden. 
Nach genauerer Recherche kamen wir darauf, dass die Authentifizierung mittels eines Tokens und Cookies umgesetzt werden muss. Nachdem wir uns die Theorie dahinter angeschaut haben und versucht habe diesen mit dem Modul jsonwebtoken umzusetzen, konnten wir leider aus zeitlichen Gründen die Implementierung nicht vollständig umsetzen. 
Daher hat die Anwendung momentan leider noch keinen komplett funktionstüchtigen Login. 


6.	Android App

Der Kern der verteilten Anwendung liegt in der Android App. Hier werden die Beacons per Bluetooth gescannt und zu Netzwerken hinzugefügt. Die Applikation verfügt außerdem über einen Login, Homescreen, Settings,  Meine Beacons, Meine Netzwerke und einen Monitoring Service.

6.1 Android Beacon Library

Damit die Kommunikation zwischen der Android App und den Beacons funktioniert wurde die Android Beacon Library verwendet (https://altbeacon.github.io/android-beacon-library/index.html).
Durch Verwendung der Library kann permanent nach Beacons gesucht werden. Hierfür wird in der Applikationsklasse das Interface Bootstrapnotifier implementiert. Somit müssen folgende Methoden implementiert werden:
•	didEnterRegion 
o	Ein oder mehrere Beacons sind in Reichweite
•	didExitRegion
o	Ein oder mehrere Beacons sind außerhalb der Reichweite
•	didDetermineStateForRegion
o	Status eines Beacons wurde gewechselt
Region: Ein Objekt, welches die Region bzw. Reichweite darstellen soll
Die Verwaltung der Beacons funktioniert über ein Objekt der Klasse Beaconmanager. Hier können unterschiedlich Einstellungen vorgenommen werden. Eine wichtige Einstellung diesbezüglich ist die Scan Period:
beaconManager.setBackgroundBetweenScanPeriod(scanPeriod*1000);
Es wird die Zeit zwischen den einzelne Bluetooth Scans eingestellt während die App geschlossen ist(in Millisekunden). Eine weitere Einstellung um einen Beacon tatsächlich zu finden ist das richtige layout eines Beacons. Somit gibt es unterschiedliche beaconhersteller (iBeacon, altbeacon, Estimote...) mit unterschiedlichen Layouts.  
beaconManager.getBeaconParsers().add(new BeaconParser().
setBeaconLayout("m:2-3=0215,i:4-19,i:20-21,i:22-23,p:24-24"));
Die Layouts werden einer Liste hinzugefügt und können somit von der App erfasst werden. 
Durch dieses Interface kann ein Monitoring Service implementiert werden, außerdem wird es benötigt für passives Scannen, während die App geschlossen ist(z.B. für Notifications in der Statusleiste). 

Ein weiteres Interface um aktiv nach einem Beacon zu suchen ist das Interface BeaconConsumer. Hier wird die Methode onBeaconServiceConnect implementiert, welche ständig oder je nach Einstellung per Bluetooth die Umgebung nach Beacons mit den eingestellten Layouts absucht. Wird ein Signal erfasst, dann können die Informationen in dieser Methode direkt abgegriffen werden. 
6.2 Aufbau

BeaconNotificationApplication
Die Applikationsanwendung in der das Interface BootstrapNotifier implementiert ist und somit auch der Monitorningservice mit DidEnterRegion,DidExitRegion,.... Außerdem wird hier eine Notificatin für die Statusleiste in Android gesendet, sobald ein Beacon gefunden wurde bzw. der Status sich geändert hat.
LoginActivity 
In dieser Activity wird der Login und die Registrierung bereitgestellt. Es sind Plausibilitätsprüfungen implementiert um unzulässige eingaben zu Verhindern. Die Logindaten werden überprüft und bei erfolgreicher Logjn wird an die MainActivity weitergeleitet.
MainActivity
In dieser Acitivity wird die Sidebar und das Konstrukt für die Hauptanwendung erzeugt. Fragmente werden je nach Sidebarauswahl gewechselt(HomeFragment, RangingFragment, NetworkFragment und MonitoringFragment). Außerdem sind diverse Alerts, ein Menü und Broadcasts implementiert um die Anwendung funktionsfähig intuitiv zu gestalten.
NavDrawerListAdapter
Controller für die Verwendung der Sidebar.
NavDrawerItem
Gestaltung der einzelnen Items in der Sidebar.
GridViewAdapter
Stellt die GridView Elemente in NetworkFragment und BeaconAcitivity bereit und agiert als Controller. 
HomeFragment
Fragment für den Willkommensbildschirm.
RangingFragment
Dieses Fragment teilt sich in HeadFragment(Such-Button) und BeaconFragment(ListView) auf. In RangingFragment kann nach Beacons gesucht werden, indem durch klicken auf ScanBeacons der Service RangingService aufgerufen wird. Außerdem wird beim aufrufen des Fragments überprüft, ob Bluetooth eingeschaltet ist. 
HeadFragment
Anzeige des ScanBeacons Buttons in RangingFragment.
BeaconFragment
Stellt die ListView für die Beacons zur Verfügung. Zudem kann sie ein und ausgeblendet werden, während dem Laden bzw. Suchen nach der Beacons.
RangingService
Wird in RangingFragment angestoßen. Sobald dieser Service gestartet ist sucht er 45 Sekunden nach Beacons in Reichweite mittels dem Interface BeaconConsumer und der Methode onBeaconServiceConnect. Wenn ein neuer Beacon gefunden wird, wird er zur ListView hinzugefügt. Falls es ein bestehender Beacon ist wird die Entfernung zum Beacon aktualisiert. Damit die ListView auf dem UI Thread aktualisiert werden kann muss ein Broadcast an die MainActivity gesendet werden, welche anschließend die ListView aktualisiert.
NetworkFragment
In diesem Fragment können Netwerke angelegt, gelöscht und bearbeitet werden. Das Kontextmenu kann über longpress aufgerufen werden. Beim Klicken auf ein vorhandenes Netzwerk wird die Beaconactivity ausgeführt. Dort können die zugehörigen Beacons angezeigt werden. Die Netwerke werden in einer GridView angezeigt und verwenden die Klasse GridViewAdapter. 
BeaconActivity
Zeigt die Beacons eines Netzwerks in einer neuen Activity an. Durch klicken können Beacons bearbeitet werden. Die Beacons sind ebenfalls in einer GridView und verwenden als Controller die Klasse GridViewAdapter. 
MonitoringFragment
Zeigt die aktuellen Monitoring Ereignisse in einer TextView an. Z.B Erscheinen eines Beacons oder ein Beacon ist außer Reichweite. 
SettingsActivity
Globale Einstellungen für die Anwendung. Es kann der Display Name geändert werden, die Scan Periode verändert werder, ein Beacon Layout hinzugefügt werden,….

6.3 Res-Drawable
Hier befinden sich die Bilddateien im png Format bzw. die Icons/Komponenten für die Applikation. HDPI, LDPI, MDPI,… steht für die größte der Bilddateien bzw. Icons/Komponenten.

6.4 Res-Layout
In den einzelnen XML-dateien befinden sich die Layouts für die Fragmente bzw. Activitys die verwendet werden. Die Namen passen zu den Klassen und können somit zugeordnet werden. Die Layouts sind Teil einer Android App und bilden den Grafischen Teil der Android App in XML ab. Hier sind Buttons, Textviews, ListViews uvm definiert. 

6.5 Res-Menu
Hier wird das Menü oder die unterschiedlichen Menüleisten für die Anwendung in XML definiert. Betrance verfügt lediglich über eine einzige menu.xml. Da die komplette Anwendung nur ein Menü benötigt.

6.6 Res-Values
Definition von Variablen, welche in der Anwendung verwendet werden. 

6.7 Res-XML
Preferences, welche in der Anwendung verwendet werden. Preferences sind Daten, die in der Anwendung dauerhaft oder für eine begrenzte Zeit gespeichert werden. Z.B. Settings, Login Tokens usw..

7.	Aufwand – Zeit

Der Aufwand entspricht dabei auch dem gelernten und dem Mehrwert dem Projekt! 

Aufwand	Zeit
Server	
Hosting	
-	Eigenen Linux Server	                         3h
-	DynDNS	2h
-	Port Forwarding	2h
-	1&1 Virtual Machine 	                         3h
MongoDB	
-	Collections festlegen	                         2h
-	JSON Attribute festlegen	                     1h
NodeJS	
-	Server implementieren	                         1h
-	Express.js REST-API	                             20h
-	Express.js Session	                             10h
Mongoose	
-	Datenbankanbindung	                             5h
-	Models definiert 	                             2h
	
Client 	
Pencil Project 	
-	Sequenzdiagramm 	                             1h
-	Prototyp	                                     5h
Webanwendung 	
-	Klickbarer Prototyp	                             20h
-	Routing angular-new-route	                     10h
-	AngularJS implementieren 	                     10h
-	Services für REST-API einbinden 	             10h
-	Authentifizierung 	                             20h
Android APP 	
-	Beacon Library funktionstüchtig gebracht	     15h
-	Erster Prototyp mit Monitoring	                 10h
-	Beacons Suche 	                                 20h
-	Login  	                                         10h
-	Sidebar hinzufügen	                             10h
-	Netzwerk	                                     10h
-	Settings	                                     10h
-	Sonstiges  	                                     20h
	

SUMME AUFWAND-ZEIT 	                                232h 
	

8.	Github 
8.1.	Sven Jaschkewitz
https://github.com/sven2101/beacon.git 
8.2.	Andreas Foitzik 
https://github.com/andreasfoitzik/KS








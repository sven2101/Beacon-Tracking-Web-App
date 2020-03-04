 # KS - Projekt im Rahmen von Prof. Dr. Udo Mueller an der Hochschule Karlsruhe - Technik und Wirtschaft
 
Kommunikationssysteme – Entwicklung eines Prototyps zur Erfassung von Bewegungsprofilen in Kooperation mit [Andreas Foitzik](https://github.com/andreasfoitzik/KS)

**Note: Dieses Repository beinhaltet lediglich die WebApp. Die Android App ist zu finden unter folgendem Repository https://github.com/sven2101/Beacon-Tracking-Android-App**

## Beschreibung
Die Idee von betrance basiert auf iBeacons. iBeacons sind einfache Bluetooth Sender mit diesen man z.B. standortabhängige Funktionen freischalten kann. Kombiniert man diese mit einer Smartphone App und einer Webanwendung können sehr gute und interessante Systeme entstehen. 

Im Rahmen dieses Projekts haben wir uns für einen Bewegungstracker zur Erstellung von Bewegungsprofilen entschieden mit welchem es möglich sein soll, anhand der iBeacons und der App die Laufwege einer Person aufzuzeigen. Unser System basiert auf drei verschiedenen Objekten Benutzern, Netzwerken und iBeacons.

Ein Netzwerk ist immer eindeutig und kann keinen oder mehrere iBeacons beinhalten. Ein Benutzer kann vorerst keinem oder mehreren Netzwerken hinzugefügt werden. Ist ein Benutzer in einem Netzwerk, dann kann er auch die Bewegungen in einem Netzwerk verfolgen.  

## Architektur

* Android App und Browser Webapp (AngularJS) als Client
* NODE.JS als Anwendungsserver
* MongoDB als Datenbank

var employeesURL = "http://services.odata.org/V3/Northwind/Northwind.svc/Employees?$format=json";

var employees = [];

getEmployees();

//dopunjuje niz zaposleni 
function getEmployees(){
		employees = getServiceData(employeesURL).value;
	}

//http request
function getServiceData(url,username, password) {

    try {
	var result;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    result = JSON.parse(xmlhttp.response);
                }
                else {
                    return false;
                }
            }
        }
        xmlhttp.open("GET", url, false, username, password);
        xmlhttp.send();
		return result;
    }
    catch (err) {       
        return err;
    		}
	}
	
//funkcija za preusmeravanje na glavnu stranu
	function redirect(){
		var x = window.location.href.replace("index","main");
		window.location.replace(x);
	}
	
//funkcija koja proverava da li se username i pw podudaraju sa postojecim zaposlenima	
	function loginValidation(){
		var username = document.getElementById("username").value;
		var password = document.getElementById("pw").value;
		var isLogged = false;
		
		for(var i in employees){
			if(employees[i].FirstName == username && employees[i].LastName == password){
				sessionStorage.setItem('loginSuccessful',true);
				isLogged = true;
				
			}
		}
		
		if(isLogged){
			redirect();
		}
		else{
			alert("Uneti podaci nisu ispravni");	
		}		
	}
let header = `<nav class="navbar navbar-expand-lg navbar-light bg-light navbar-fixed-top">
<div class="container-fluid">  
    <div id="navbarSupportedContent">
        <ul class="navbar-nav uldiv">
        
            <li class="nav-item">
            <a href="index.html" target="_self">
                    <img class="logoNew" src="/assests/images/logo.png" alt="logoNew">  
            </a>         
            </li>   
            <div id="buttons">
            <li class="nav-item">
                <button type="button" class="btn btn-light" data-toggle="modal" data-target="#modal-Login" id="loginBtn" onclick="loginFunc()">
                    LOGIN
                </button>
            </li>  
            <li class="nav-item">
                <button type="button" class="btn btn-light" data-toggle="modal" data-target="#modal-Logout" id="logoutBtn" onclick="logoutFunc()">
                    LOGOUT
                </button>
            </li> 
            </div> 
        </ul>    
    </div>
</div>
</nav>
<!--modal dialog box for the login button-->
            <div class="modal fade" id="modal-Login" role="dialog">
                <div class="modal-dialog">
                <!-- Modal content-->
                    <div class="modal-content"> 
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h3 class="modal-title">Please Login</h4>
                        </div>
                        <div class="modal-body">
                            <label for="input-userName">Username:</label>
                            <input type="text" id="input-userName" class="form-control" required>
                            <br>
                            <label for="input-password">Password:</label>
                            <input type="password" class="form-control" id="input-password" required>
                            <br>
                        </div>
                        <div class="modal-footer">
                            <div class="pull-left">
                                <button type="button" class="btn btn-primary" data-dismiss="modal" id="loginButton" onclick="validateFunc()">Login</button>  
                            </div>    
                        </div><!--modal footer-->
                    </div><!--modal content-->
                </div><!--modal dialog -->
            </div><!--modal -->`

let footer = `<footer>
<div id="footerDiv">
    <button type="button" class="btn btn-info" data-toggle="modal" data-target="#modal-contact">
        Contact Us
    </button>
    <div id="copy">
        <p>&copy;2020 ROOM SEARCH PVT. LTD.</p>
    </div>
    <div class="social">
        <a href="https://www.facebook.com/" target="_blank"><img class="socialMedia" src="/assests/images/facebook.png"></a>
        <a href="https://www.instagram.com/" target="_blank"><img class="socialMedia" src="assests/images/instagram.png"></a>
        <a href="https://www.twitter.com/" target="_blank"><img class="socialMedia" src="/assests/images/twitter.png"></a>
    </div>  
</div>

</footer>
<div class="modal fade" id="modal-contact" role="dialog">
<div class="modal-dialog">
<!-- Modal content-->
    <div class="modal-content"> 
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h3 class="modal-title">Get in touch</h4>
        </div>
        <div class="modal-body">
            <p>Thankyou for reaching out!!!</p>
            <p>Please enter your email and we will get back to you</p>
            <br>
            <label for="input-email">Email:</label>
            <input type="email" id="input-email" placeholder = "Enter your email id" required>
            <br>
        </div>
        <div class="modal-footer">
            <div class="pull-right">
                <button type="button" class="btn btn-primary" data-dismiss="modal">Submit</button>  
            </div>    
        </div><!--modal footer-->
    </div><!--modal content-->
</div><!--modal dialog -->
</div><!--modal -->`

document.getElementById("headerTemplate").innerHTML = header;
document.getElementById("footerTemplate").innerHTML = footer;

    //clear the login form and the userid and password to local storage
    function loginFunc(){
        document.getElementById("input-userName").value = "";
        document.getElementById("input-password").value = "";
        localStorage.setItem("userName","admin");
        localStorage.setItem("password","admin");
        }  

//     //hide the logout button and unhide the login button
    function logoutFunc(){
        document.getElementById("logoutBtn").style.display = "none"; 
        document.getElementById("loginBtn").style.display = "block";
        localStorage.removeItem("userName");
        localStorage.removeItem("password");
    }    

    function validateFunc(){
        let userid = document.getElementById("input-userName").value;
        let passwd = document.getElementById("input-password").value;
        let localUserid = localStorage.getItem("userName");
        let localPasswd = localStorage.getItem("password");
        if ((userid === localUserid) && (passwd === localPasswd))
        {
            alert("Successfully LoggedIn");
            //hide the login button and unhide the logout button
            document.getElementById("loginBtn").style.display = "none";
            document.getElementById("logoutBtn").style.display = "block";
        
        }
        else {
            alert("Incorrect UserName / Password. Try again!!");
        }
    };  
    
    
    //if the logo button is being clicked on index.html then the standard event should not work

    // document.getElementById("logo").onclick = function(){
    // let fileInput = document.getElementById("logo");   
    // let filename = fileInput.files[0].name;
    // alert(filename);
    // }

    
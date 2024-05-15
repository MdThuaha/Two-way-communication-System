$(() => {
    var socket = io("http://localhost:8057");
    //socket events
    socket.on("connect", () => {
      var uploader = new SocketIOFileUpload(socket);
      uploader.listenOnInput(document.getElementById("fu"));
      socket.on("connectionsuccess", (msg) => {
        console.log(msg);
        $("#join-div").show();
      });
      socket.on("userlist", (users) => {
        console.log(users);
        $("#join-div").hide();
        $("#chat-div").show();
        $("#users").empty();
        $("#to").empty();
        users.forEach((u) => {
          $("#users").append(`<li>${u.username}</li>`);
          $("#to").append(`<option value='${u.id}'>${u.username}</option>`);
        });
        $("#to").append(`<option value='' selected>Select one</option>`);
      });
      socket.on("message", (o) => {
        $("#messages").append(`<li>From ${o.from}: ${o.msg}</li>`);
      });
      socket.on("privateshare", (data, u) => {
        console.log(data);
        console.log(u);
        $("#private").append(`<div class='share'>
                                <div>From ${u}</div>
                            <div>Name: ${data.name}</div>
                            <div>Phone: ${data.phone}</div>
                            <div>Email: ${data.email}</div>
                            <div>
                            `);
      });
      socket.on("uploaded", (m) => {
        console.log(m);
        $("#file-box").append(`<div class='box'>
            <img src="uploads/${m.type == "image" ? m.file : "file.png"}" />
            <div>Uploaded by ${m.from}</div>
            <div><a target='_blank' href="uploads/${m.file}">Download</a></div>
        </div>`);
      });
      //buttons
      $("#join").click(() => {
        console.log("join");
        socket.emit("addme", $("#user").val());
        $("#display-name").html("Connected as " + $("#user").val());
      });
      $("#send").click(() => {
        console.log("send");
        socket.emit("send", $("#msg").val());
        $("#msg").val("");
      });
      $("#share").click(() => {
        if (document.getElementById("form").checkValidity()) {
          socket.emit("share", {
            to: $("#to").val(),
            name: $("#name").val(),
            phone: $("#number").val(),
            email: $("#email").val()
          });
          document.getElementById("form").reset();
        }
      });
      $("#browse").click(() => {
        $("#fu").trigger("click");
      });
    });
  });
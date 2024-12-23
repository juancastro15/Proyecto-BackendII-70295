// escucho el formulario para crear usuarios nuevos
const form = document.getElementById("usersForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const newUser = {};
  data.forEach((value, key) => (newUser[key] = value));
  //   console.log("Usuario creado:", newUser);

  // le pego al endpoint de creación de usuarios
  fetch("/api/users/register", {
    method: "POST",
    body: JSON.stringify(newUser),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((result) => {
    if (result.status === 201) {
      // reseteo los campos del form para no refrescar la ventana
      form.reset();
      return result.json().then((json) => {
        Swal.fire({
          icon: "success",
          title: "User created successfully",
        });
        return json;
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error or invalid user, all fields are required",
      });
    }
  });
});
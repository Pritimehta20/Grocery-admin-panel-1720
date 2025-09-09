import React from 'react'
import Swal from 'sweetalert2';
const Successalert = (title) => {
   const alert = Swal.fire({
        icon : "success",
        title: title,
        confirmButtonColor : "#00b050"
    });

    return alert
}

export default Successalert
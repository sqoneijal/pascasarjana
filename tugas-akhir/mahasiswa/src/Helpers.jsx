import axios from "axios";
import DataTables from "datatables.net";
import $ from "jquery";
import lozad from "lozad";
import moment from "moment";
import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Flatpickr from "react-flatpickr";
import Swal from "sweetalert2";
import toastr from "toastr";
import { uid } from "uid/secure";
import wNumb from "wnumb";

export const renderGoogleDrivePermalink = (id_google_drive, label) => {
   if (id_google_drive) {
      return (
         <a href={`https://drive.google.com/file/d/${id_google_drive}/view`} target="_blank">
            {label}
         </a>
      );
   }
};

export const getDriveFile = (id) => {
   return `https://drive.google.com/file/d/${id}/view`;
};

export const getFile = (filename, folder = "") => {
   const { hostname, protocol } = window.location;

   const folderPath = folder ? `/${folder}` : "/";
   return `${protocol}//${hostname}:8012/media${folderPath}/${filename}`;
};

export const cdn = (filepath) => {
   return process.env.NODE_ENV === "deploy" ? `https://cdn.tesis.ar-raniry.ac.id/${filepath}` : `http://localhost:8012/${filepath}`;
};

export const form_upload = (label, name, config = {}, required = false, errors = {}) => {
   const uniqueID = `${name}_${uid(32)}`;

   return (
      <Form.Floating className="mb-2">
         <Form.Control title={label} type="file" placeholder={label} id={uniqueID} name={name} {...config} isInvalid={is_invalid(name, errors)} />
         <Form.Label htmlFor={uniqueID} className={required ? "required" : ""}>
            {label}
         </Form.Label>
         {msg_response(name, errors)}
      </Form.Floating>
   );
};

const abortSignal = (timeoutMs) => {
   const abortController = new AbortController();
   setTimeout(() => abortController.abort(), timeoutMs || 0);
   return abortController.signal;
};

const hapus = async (url, id, custom = {}) => {
   const formData = {
      id,
      ...custom,
   };

   try {
      return await post(url, formData);
   } catch (e) {
      notification(false, e.code, e.message);
   }
};

export const get = async (url, dynamic = false) => {
   try {
      const mutex = {
         locked: false,
         lock() {
            if (this.locked) {
               // Menunggu sampai sumber daya tersedia
               return new Promise((resolve) => {
                  setTimeout(() => {
                     resolve(this.lock());
                  }, 10);
               });
            } else {
               this.locked = true;
               return Promise.resolve();
            }
         },
         unlock() {
            this.locked = false;
         },
      };

      await mutex.lock();

      const send = axios.get(dynamic ? url : `${window.location.pathname}${url}`, {
         signal: abortSignal(10_000),
      });
      send.then((res) => {
         const { data } = res;
         if (typeof data.code !== "undefined" && parse("code", data) !== 200) {
            notification(false, data.message, error_code_http(data.code));
         }
      });
      send.catch((e) => {
         if (e.code === "ERR_CANCELED") {
            notification(false, "Sistem sedang sibuk, silahkan coba beberapa saat lagi!", e.code);
         } else {
            notification(false, e.message, error_code_http(e.response.status));
         }
      });

      mutex.unlock();
      return await send;
   } catch (error) {
      // error
   }
};

export const notification = (status, msg_response, title) => {
   toastr.options = {
      closeButton: false,
      debug: false,
      newestOnTop: true,
      progressBar: true,
      positionClass: "toast-top-center",
      preventDuplicates: false,
      onclick: null,
      showDuration: "300",
      hideDuration: "1000",
      timeOut: "5000",
      extendedTimeOut: "1000",
      showEasing: "swing",
      hideEasing: "linear",
      showMethod: "fadeIn",
      hideMethod: "fadeOut",
   };

   if (status) {
      toastr.success(msg_response);
   } else {
      toastr.error(msg_response, title);
   }
};

export const error_code_http = (code) => {
   const config = {
      100: "Continue",
      101: "Switching Protocols",
      102: "Processing",
      103: "Early Hints",
      122: "Request-URI too long",
      127: "Network Authentication Required",
      150: "Continue",
      151: "Switching Protocols",
      152: "Processing",
      153: "Early Hints",
      158: "Request-URI too long",
      159: "Network Authentication Required",
      180: "Continue",
      181: "Switching Protocols",
      182: "Processing",
      183: "Early Hints",
      188: "Request-URI too long",
      189: "Network Authentication Required",
      199: "Network Authentication Required",
      200: "OK",
      201: "Created",
      203: "Non-Authoritative Information",
      204: "No Content",
      205: "Reset Content",
      206: "Partial Content",
      207: "Multi-Status",
      208: "Already Reported",
      226: "IM Used",
      250: "Continue",
      251: "Switching Protocols",
      252: "Processing",
      253: "Early Hints",
      258: "Request-URI too long",
      259: "Network Authentication Required",
      299: "Network Authentication Required",
      300: "Multiple Choices",
      301: "Moved Permanently",
      302: "Found",
      303: "See Other",
      304: "Not Modified",
      305: "Use Proxy",
      307: "Temporary Redirect",
      308: "Permanent Redirect",
      310: "Too many Redirect",
      399: "Client Closed Request",
      400: "Bad Request",
      401: "Unauthorized",
      402: "Payment Required",
      403: "Forbidden",
      404: "Not Found",
      405: "Method Not Allowed",
      406: "Not Acceptable",
      407: "Proxy Authentication Required",
      408: "Request Timeout",
      409: "Conflict",
      410: "Gone",
      411: "Length Required",
      412: "Precondition Failed",
      413: "Payload Too Large",
      414: "URI Too Long",
      415: "Unsupported Media Type",
      416: "Range Not Satisfiable",
      417: "Expectation Failed",
      418: "I'm a teapot",
      421: "Misdirected Request",
      422: "Unprocessable Entity",
      423: "Locked",
      424: "Failed Dependency",
      426: "Upgrade Required",
      428: "Precondition Required",
      429: "Too Many Requests",
      431: "Request Header Fields Too Large",
      451: "Unavailable For Legal Reasons",
      499: "Client Closed Request",
      500: "Internal Server Error",
      501: "Not Implemented",
      502: "Bad Gateway",
      503: "Service Unavailable",
      504: "Gateway Timeout",
      505: "HTTP Version Not Supported",
      506: "Variant Also Negotiates",
      507: "Insufficient Storage",
      508: "Loop Detected",
      510: "Not Extended",
      511: "Network Authentication Required",
      599: "Network Authentication Required",
   };

   return typeof config[code] === "undefined" ? "Terjadi sesuatu kesalahan" : config[code];
};

export const parse = (key, content = {}, type = "text") => {
   if (typeof content[key] === "undefined") {
      return "";
   }
   let text = content[key];
   if (text == null || text == "") {
      return "";
   }
   text = text.toString();
   if (type === "rupiah") {
      return toInt(text) > 0 ? wNumb({ thousand: ".", prefix: "Rp " }).to(toInt(text)) : "Rp 0";
   }
   if (type === "date" && valid_date(text)) {
      moment.locale("id");
      if (text !== "-") return moment(text).format("DD MMMM YYYY");
   }
   if (type === "jam") {
      return moment(text, "HH:mm").format("hh:mm A");
   }
   if (text.slice(0, 1) == "0") {
      return text.replace(/^(?:\s+|\s+)$/gm, "");
   }
   if (text.replace(/\d/gm, "").length > 0) {
      return text;
   }
   return toInt(text) > 0 ? toInt(text) : text.replace(/^(?:\s+|\s+)$/gm, "");
};

export const toInt = (string) => {
   return isNaN(parseFloat(string)) ? 0 : parseFloat(string);
};

export const valid_date = (dateString) => {
   if (dateString === "-") {
      return false;
   } else {
      const date = moment(dateString, true);

      // Mengecek apakah tanggal valid
      return date.isValid();
   }
};

export const buttons = (label, isLoading = false, init = {}) => {
   // Menghapus semua spasi dalam string
   const tanpaSpasi = label.replace(/\s+/g, "");

   // Mengubah huruf menjadi huruf kecil (lowercase)
   const hurufKecil = tanpaSpasi.toLowerCase();

   return (
      <Button
         type="submit"
         id={hurufKecil}
         name={hurufKecil}
         disabled={isLoading}
         size="sm"
         className={`fw-bold border-0 ${parse("className", init)}`}
         {...init}>
         {isLoading ? (
            <span className="indicator-label">
               Loading... <span className="spinner-border spinner-border-sm align-middle ms-2" />
            </span>
         ) : (
            <span className="indicator-label">{label}</span>
         )}
      </Button>
   );
};

export const arrLength = (content = []) => {
   return content.length > 0;
};

export const objLength = (content = {}) => {
   return Object.keys(content).length > 0;
};

export const pageType = (page) => {
   const config = {
      insert: "Tambah",
      update: "Perbaharui",
   };
   return parse(page, config);
};

export const form_text = (label, name, config = {}, required = false, errors = {}) => {
   const uniqueID = `${name}_${uid(32)}`;

   return (
      <Form.Floating className="mb-2">
         <Form.Control type="text" title={label} placeholder={label} id={uniqueID} name={name} {...config} isInvalid={is_invalid(name, errors)} />
         <Form.Label htmlFor={uniqueID} className={required ? "required" : ""}>
            {label}
         </Form.Label>
         {msg_response(name, errors)}
      </Form.Floating>
   );
};

export const is_invalid = (key, object = {}) => {
   return !!parse(key, object);
};

export const msg_response = (key, object = {}) => {
   if (parse(key, object)) {
      return <Form.Control.Feedback type="invalid">{parse(key, object)}</Form.Control.Feedback>;
   }
};

export const post = async (url, form = [], config = {}, dynamic = false) => {
   try {
      const mutex = {
         locked: false,
         lock() {
            if (this.locked) {
               // Menunggu sampai sumber daya tersedia
               return new Promise((resolve) => {
                  setTimeout(() => {
                     resolve(this.lock());
                  }, 10);
               });
            } else {
               this.locked = true;
               return Promise.resolve();
            }
         },
         unlock() {
            this.locked = false;
         },
      };

      await mutex.lock();
      const formData = new FormData();
      Object.keys(form).forEach((data) => formData.append(data, form[data]));

      const send = axios.post(dynamic ? url : `${window.location.pathname}${url}`, formData, { ...config, signal: abortSignal(50_000) });
      send.then((res) => {
         const { data } = res;
         if (typeof data.code !== "undefined" && parse("code", data) !== 200) {
            notification(false, data.message, error_code_http(data.code));
         }
      });
      send.catch((e) => {
         if (e.code === "ERR_CANCELED") {
            notification(false, "Sistem sedang sibuk, silahkan coba beberapa saat lagi!", e.code);
         } else {
            notification(false, e.message, error_code_http(e.response.status));
         }
      });

      mutex.unlock();
      return await send;
   } catch (error) {
      // error
   }
};

let dt;
const DatatableServerSide = ({ ...content }) => {
   const renderColumnDefs = [
      {
         targets: -1,
         data: null,
         orderable: false,
         className: "text-end",
         width: "5%",
         render: () => renderButtons(content),
      },
   ];

   DataTables.defaults = {
      ...DataTables.defaults,
      renderer: "bootstrap",
   };

   DataTables.ext.classes = {
      ...DataTables.ext.classes,
      container: "dataTables_wrapper dt-bootstrap4 no-footer",
      empty: { row: "dataTables_empty" },
      processing: { container: "dataTables_processing" },
      length: { container: "dataTables_length", select: "form-select form-select-sm form-select-solid" },
      info: { container: "dataTables_info" },
   };

   DataTables.ext.renderer.pagingContainer.bootstrap = renderPagingContainer;

   DataTables.ext.renderer.pagingButton.bootstrap = renderPagingButton;

   dt = new DataTables(`${parse("id", content) ? parse("id", content) : "#datatable"}`, {
      processing: true,
      serverSide: true,
      pageLength: 10,
      ajax: {
         url: `${window.location.pathname}${content.url}`,
         data: (e) => {
            return $.extend({}, e, content.filter);
         },
         type: "post",
         error: handleError,
      },
      columns: content.columns,
      columnDefs: content.columnDefs ? renderColumnDefs : [],
      language: getLanguage(),
      order: content.order,
      initComplete: initializeComplete,
      drawCallback,
      createdRow: content.createdRow,
      dom: getDom(),
   });
};

// Extracted functions
function renderButtons(content) {
   let button_render = "";
   if (parse("custom_button", content)) button_render += parse("custom_button", content);
   if (content.show_edit_button)
      button_render +=
         '<a href="#" id="edit" class="btn btn-active-icon-warning btn-active-text-warning btn-sm p-0 m-0"><i class="ki-outline ki-notepad-edit fs-1"></i></a>';
   if (content.show_delete_button)
      button_render +=
         '<a href="#" id="delete" class="btn btn-active-icon-danger btn-active-text-danger btn-sm p-0 m-0"><i class="ki-outline ki-trash-square fs-1"></i></a>';

   return button_render;
}

function renderPagingContainer(settings, buttonEls) {
   return $("<ul/>").addClass("pagination").append(buttonEls);
}

function renderPagingButton(settings, buttonType, content, active, disabled) {
   const btnClasses = ["paginate_button", "page-item"];

   if (active) {
      btnClasses.push("active");
   }

   if (disabled) {
      btnClasses.push("disabled");
   }

   const li = $("<li>").addClass(btnClasses.join(" "));
   const a = $("<a>", {
      href: disabled ? null : "#",
      class: "page-link",
   })
      .html(content)
      .appendTo(li);

   return {
      display: li,
      clicker: a,
   };
}

function handleError(xhr) {
   if (xhr) notification(false, xhr.statusText);
}

function getLanguage() {
   return {
      processing: '<div class="d-flex flex-column flex-center"><span class="text-gray-600">Loading...</span></div>',
      emptyTable: "No data available in table",
      info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ data",
      infoEmpty: "Tidak ada data untuk ditampilkan",
      infoFiltered: "(disaring dari _MAX_ data keseluruhan)",
      zeroRecords: "Tidak ditemukan data yang sesuai",
      thousands: ".",
      infoThousands: ".",
      lengthMenu: "_MENU_",
      paginate: {
         first: '<i class="first"></i>',
         last: '<i class="last"></i>',
         next: '<i class="next"></i>',
         previous: '<i class="previous"></i>',
      },
   };
}

function initializeComplete(e) {
   lozad().observe();
}

function drawCallback(settings) {
   lozad().observe();
   $(settings.nTBody).find(".dataTables_empty").html("Tidak ada data yang tersedia pada tabel ini");
}

function getDom() {
   return (
      "<'table-responsive'tr>" +
      "<'row'" +
      "<'col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start'li>" +
      "<'col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end'p>" +
      ">"
   );
}

export const handleFilterDatatable = (url, content = {}) => {
   dt.ajax.url(`${window.location.pathname}${url}?${serialize(content)}`).load();
};

export const handleSearchDatatable = (value) => {
   dt.search(value).draw();
};

export const dtReload = () => {
   dt.ajax.reload(null, false);
};

export const initDatatable = ({ ...content }) => {
   return {
      reload: () => {
         dt.ajax.reload(null, false);
      },
      init: () => {
         DatatableServerSide(content);
      },
   };
};

export const serialize = (obj) => {
   const str = [];
   for (const p in obj) {
      if (Object.hasOwn(obj, p)) {
         str.push(`${encodeURIComponent(p)}=${encodeURIComponent(obj[p])}`);
      }
   }
   return str.join("&");
};

export const confirm = async (message) => {
   return await Swal.fire({
      text: message,
      icon: "warning",
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonText: "Iya, sudah",
      cancelButtonText: "Belum",
      customClass: {
         confirmButton: "btn btn-sm fw-bold btn-primary",
         cancelButton: "btn btn-sm fw-bold btn-danger",
      },
   });
};

export const form_select = (label, name, config = {}, dropdown = [], required = false, errors = {}) => {
   const uniqueID = `${name}_${uid(32)}`;

   return (
      <Form.Floating className="mb-2">
         <Form.Control title={label} as="select" placeholder={label} id={uniqueID} name={name} {...config} isInvalid={is_invalid(name, errors)}>
            <option value="">--pilih--</option>
            {option_list(dropdown)}
         </Form.Control>
         <Form.Label htmlFor={uniqueID} className={required ? "required" : ""}>
            {label}
         </Form.Label>
         {msg_response(name, errors)}
      </Form.Floating>
   );
};

export const option_list = (content = []) => {
   const opt = [];
   content.forEach((row) => {
      opt.push(
         <option value={parse("value", row)} key={parse("value", row)} data-index={parse("index", row) ? parse("index", row) : parse("value", row)}>
            {row.label}
         </option>
      );
      return opt;
   });
   return opt;
};

export const date_picker = (label, name, config = {}, required = false, errors = {}) => {
   return (
      <Form.Floating className="mb-2">
         <Flatpickr
            className={`form-control ${is_invalid(name, errors) ? "is-invalid" : ""}`}
            placeholder={label}
            id={`for_${name}`}
            name={name}
            {...config}
         />
         <Form.Label htmlFor={`for_${name}`} className={required ? "required" : ""}>
            {label}
         </Form.Label>
         {msg_response(name, errors)}
      </Form.Floating>
   );
};

export const detail_label = (label, value, span = 0) => {
   return (
      <Row className="mb-2">
         <Col md={span} sm={12} className={`fw-semibold text-muted`}>
            {label}
         </Col>
         <Col md={12 - span} sm={12}>
            <span title={value} className={`fw-bold fs-6 text-gray-800`}>
               {value || "-"}
            </span>
         </Col>
      </Row>
   );
};

export const renderArray = (array, nilai) => {
   const booleanItem = array.find((item) => item.value === nilai);

   return booleanItem ? booleanItem.label : "-";
};

export const form_password = (label, name, config = {}, required = false, errors = {}) => {
   const uniqueID = `${name}_${uid(32)}`;

   return (
      <Form.Floating className="mb-2">
         <Form.Control type="password" title={label} placeholder={label} id={uniqueID} name={name} {...config} isInvalid={is_invalid(name, errors)} />
         <Form.Label htmlFor={uniqueID} className={required ? "required" : ""}>
            {label}
         </Form.Label>
         {msg_response(name, errors)}
      </Form.Floating>
   );
};

export const form_textarea = (label, name, config = {}, required = false, errors = {}) => {
   const uniqueID = `${name}_${uid(32)}`;

   return (
      <Form.Floating className="mb-2">
         <Form.Control title={label} as="textarea" placeholder={label} id={uniqueID} name={name} {...config} isInvalid={is_invalid(name, errors)} />
         <Form.Label htmlFor={uniqueID} className={required ? "required" : ""}>
            {label}
         </Form.Label>
         {msg_response(name, errors)}
      </Form.Floating>
   );
};

export const table_loading = (colSpan = 0) => {
   return (
      <tr>
         <td colSpan={colSpan} className="text-center">
            <span className="spinner-border w-15px h-15px text-muted align-middle me-2" />
            <span className="text-gray-600">Loading...</span>
         </td>
      </tr>
   );
};

export const table_empty = (colSpan = 0) => {
   return (
      <tr className="odd">
         <td colSpan={colSpan} className="dataTables_empty" style={{ verticalAlign: "top" }}>
            <div className="d-flex flex-column flex-center">
               <div className="fs-4 fw-bolder text-dark mb-4">Tidak ada item yang ditemukan.</div>
            </div>
         </td>
      </tr>
   );
};

export const keterangan_halaman = (title, content = []) => {
   return (
      <div className="alert alert-dismissible bg-light-primary border border-primary d-flex flex-column flex-sm-row p-5 mb-5">
         <div className="d-flex flex-column pe-0 pe-sm-10">
            <h5 className="mb-1">{title}</h5>
            <div className="d-flex flex-column">
               {(() => {
                  const list = [];
                  if (content.length > 1) {
                     content.forEach((row) => {
                        list.push(
                           <li className="d-flex align-items-center" key={row}>
                              <span className="bullet bullet-dot bg-primary me-5" /> {row}
                           </li>
                        );
                        return list;
                     });
                  } else {
                     list.push(content[0]);
                     return list;
                  }
                  return list;
               })()}
            </div>
         </div>
      </div>
   );
};

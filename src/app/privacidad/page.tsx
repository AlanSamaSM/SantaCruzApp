import { PROPERTY_NAME, CONTACT } from "@/lib/constants";

export const metadata = {
  title: "Aviso de Privacidad — Santa Cruz Suites",
};

export default function PrivacidadPage() {
  const lastUpdated = "11 de marzo de 2026";

  return (
    <main className="min-h-[calc(100dvh-4rem)] px-6 pb-24 pt-8">
      <article className="prose prose-sm mx-auto max-w-lg text-text-primary prose-headings:text-text-primary prose-p:text-text-secondary prose-li:text-text-secondary prose-a:text-brand-accent">
        <h1 className="text-xl font-bold">Aviso de Privacidad</h1>
        <p className="text-xs text-text-secondary">
          Última actualización: {lastUpdated}
        </p>

        <h2>I. Identidad del Responsable</h2>
        <p>
          <strong>{PROPERTY_NAME}</strong>, con domicilio en {CONTACT.address},
          es responsable del tratamiento de los datos personales que recabamos de
          usted, de conformidad con la Ley Federal de Protección de Datos
          Personales en Posesión de los Particulares (LFPDPPP) y su Reglamento,
          así como con las reformas vigentes publicadas en el Diario Oficial de
          la Federación.
        </p>

        <h2>II. Datos Personales Recabados</h2>
        <p>
          Para las finalidades señaladas en este aviso, podemos recabar las
          siguientes categorías de datos personales:
        </p>
        <ul>
          <li>
            <strong>Datos de identificación:</strong> Nombre y dirección de
            correo electrónico (únicamente cuando usted se registre
            voluntariamente).
          </li>
          <li>
            <strong>Datos de navegación:</strong> Información técnica del
            dispositivo y navegador, páginas visitadas dentro de la aplicación
            (exclusivamente con su consentimiento).
          </li>
          <li>
            <strong>Datos de geolocalización:</strong> Ubicación aproximada para
            mostrar su posición en el mapa interactivo (requiere consentimiento
            explícito).
          </li>
          <li>
            <strong>Datos de uso:</strong> Interacción con cupones y
            promociones, identificadores anónimos (hashes) de redención de
            códigos QR.
          </li>
        </ul>

        <h2>III. Finalidades del Tratamiento</h2>
        <p>Sus datos personales serán utilizados para las siguientes finalidades:</p>
        <p><strong>Finalidades primarias (necesarias):</strong></p>
        <ul>
          <li>Facilitar el acceso al estacionamiento y áreas comunes mediante código QR.</li>
          <li>Proveer información sobre restaurantes y comercios locales cercanos.</li>
          <li>Habilitar la funcionalidad offline de la aplicación.</li>
        </ul>
        <p><strong>Finalidades secundarias (opcionales):</strong></p>
        <ul>
          <li>Envío de promociones y descuentos exclusivos de establecimientos aliados.</li>
          <li>Comunicaciones de seguimiento post-estancia con ofertas de reserva directa.</li>
          <li>Análisis estadístico agregado y anónimo para mejorar los servicios.</li>
        </ul>
        <p>
          Si usted no desea que sus datos sean tratados para las finalidades
          secundarias, puede indicarlo en el momento de otorgar su
          consentimiento seleccionando la opción &quot;Solo esenciales&quot;.
        </p>

        <h2>IV. Transferencia de Datos</h2>
        <p>
          {PROPERTY_NAME} podrá transferir identificadores anónimos y
          codificados criptográficamente (nunca datos personales directos) a los
          establecimientos comerciales afiliados, exclusivamente con la finalidad
          de validar la redención de cupones y promociones. No se transfieren
          nombres, correos electrónicos ni datos de contacto a terceros sin su
          consentimiento expreso.
        </p>

        <h2>V. Derechos ARCO</h2>
        <p>
          Usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse al
          tratamiento de sus datos personales (derechos ARCO). Para ejercer
          cualquiera de estos derechos, puede enviarnos un correo electrónico a{" "}
          <strong>{CONTACT.email || "[email de contacto por definir]"}</strong>{" "}
          con los siguientes datos:
        </p>
        <ul>
          <li>Nombre completo y correo electrónico registrado.</li>
          <li>Descripción clara del derecho que desea ejercer.</li>
          <li>Cualquier documento que acredite su identidad.</li>
        </ul>
        <p>
          Daremos respuesta a su solicitud en un plazo máximo de 20 días hábiles,
          contados a partir de la fecha de recepción. En caso de cancelación,
          la supresión de sus datos se ejecutará de manera recursiva en todos
          nuestros archivos, bases de datos y sistemas de respaldo.
        </p>

        <h2>VI. Mecanismos de Seguridad</h2>
        <p>
          Implementamos medidas de seguridad técnicas, administrativas y físicas
          para proteger sus datos personales contra daño, pérdida, alteración,
          destrucción o uso no autorizado, incluyendo el cifrado de datos en
          tránsito (HTTPS/TLS), almacenamiento seguro en infraestructura
          verificada, y controles de acceso basados en roles.
        </p>
        <p>
          En cumplimiento con el Artículo 20 de la LFPDPPP, en caso de
          vulneración de seguridad que afecte significativamente los derechos
          patrimoniales o morales de los titulares, se les notificará de forma
          inmediata para que puedan tomar las medidas correspondientes.
        </p>

        <h2>VII. Consentimiento</h2>
        <p>
          El uso de esta aplicación para la funcionalidad de acceso al
          estacionamiento no requiere consentimiento para el tratamiento de datos
          personales adicionales. Las funcionalidades que involucran
          geolocalización, almacenamiento local y comunicaciones de marketing
          requerirán su consentimiento explícito, libre, específico e informado,
          el cual podrá revocar en cualquier momento.
        </p>

        <h2>VIII. Cambios al Aviso de Privacidad</h2>
        <p>
          Nos reservamos el derecho de modificar este Aviso de Privacidad en
          cualquier momento. Las modificaciones serán publicadas y accesibles a
          través de esta misma aplicación. Le recomendamos consultar
          periódicamente este aviso para estar informado sobre cualquier cambio.
        </p>
      </article>
    </main>
  );
}

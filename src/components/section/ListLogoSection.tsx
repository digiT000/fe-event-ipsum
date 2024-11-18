import Image from "next/image";

function ListLogo() {
  return (
    <section id="socialProof" className="px-4 py-6 bg-zinc-100">
      <div className="max-w-screen-xl mx-auto text-center">
        <h6 className="mb-6 md:mb-10 text-gray-900">
          We’re feature by top startup in global
        </h6>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 ">
          <Image
            src="/logo/dummy_logo-1.svg"
            className="h-6 md:h-8 grayscale"
            width={150}
            height={150}
            alt="logo-1"
          />
          <Image
            src="/logo/dummy_logo-2.svg"
            className="h-6 md:h-8 grayscale"
            width={150}
            height={150}
            alt="logo-1"
          />
          <Image
            src="/logo/dummy_logo-3.svg"
            className="h-6 md:h-8 grayscale"
            width={150}
            height={150}
            alt="logo-1"
          />
          <Image
            src="/logo/dummy_logo-4.svg"
            className="h-6 md:h-8 grayscale"
            width={150}
            height={150}
            alt="logo-1"
          />
        </div>
      </div>
    </section>
  );
}

export default ListLogo;

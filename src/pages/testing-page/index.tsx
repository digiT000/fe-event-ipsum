import MultiPurposeModal from "@/components/MultiPurposeModal";
import { useEffect, useState } from "react";

function Index() {
  const [showModal, setShowModal] = useState(false);
  const [showDelayedModal, setShowDelayedModal] = useState(false);

  useEffect(() => {
    if (showModal) {
      console.log("exec");
      setTimeout(() => {
        setShowDelayedModal(showModal);
      }, 10); // Adjust the delay as needed
    } else {
      setTimeout(() => {
        setShowDelayedModal(showModal);
      }, 10); // Adjust the delay as needed
    }
  }, [showModal]);
  // return (
  //   // <>
  //   //   {showModal ? (
  //   //     <MultiPurposeModal
  //   //       isShow={showDelayedModal}
  //   //       title="Ini Header"
  //   //       subTitle="test"
  //   //       type="BOOKING SUCCESS"
  //   //     />
  //   //   ) : (
  //   //     ""
  //   //   )}
  //   //   <button
  //   //     className="absolute right-0 z-[99]"
  //   //     onClick={() => {
  //   //       console.log("click");
  //   //       setShowModal(!showModal);
  //   //     }}
  //   //   >
  //   //     Show/hide
  //   //   </button>
  //   // </>
  // )
}

export default Index;

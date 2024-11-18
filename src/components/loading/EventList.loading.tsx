import EventListLoadingItem from "./EventList.loadingItem";
function EventListLoading() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-1 lg:gap-4 ">
      <EventListLoadingItem />
      <EventListLoadingItem />
      <EventListLoadingItem />
      <EventListLoadingItem />
      <EventListLoadingItem />
      <EventListLoadingItem />
    </div>
  );
}

export default EventListLoading;

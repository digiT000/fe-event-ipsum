import { Suspense } from "react";
import { EventHandlerApi } from "@/utils/eventHandler";
import { Category } from "@/models/categoryList";
import { EventCardProps } from "@/models/models";
import React, { useEffect, useRef, useState } from "react";
import InputField from "../InputField";
// import EventCard from "../EventCard";
import EventList from "../EventList";
import EventListLoading from "../loading/EventList.loading";
import CategoryListLoading from "../loading/CategoryList.loading";
import RadioChips from "../RadioChips";
import EmptyResultSection from "./EmptyResultSection";

function EventListSection() {
  const eventHandlerApi = new EventHandlerApi(); // Initialize event handler API
  const [eventIsLimit, setEventIsLimit] = useState<boolean>(false);
  const [isLoadingButton, setIsLoadingButton] = useState<boolean>(false);
  const [inputSearch, setInputSearch] = useState<string>("");
  const [eventData, setEventData] = useState<EventCardProps[]>([]);
  const [isLoadingEvent, setIsLoadingEvent] = useState(true); // Track data loading state
  const isInitialRender = useRef<boolean>(true); // Check if its already be render or not
  const [lastCursor, setLastCursor] = useState<number | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string>("0");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);
  const [emptyResult, setEmptyResult] = useState<boolean>(false);

  // Handle Input Search (Debounced)
  function handleInputSearch(newValue: string) {
    setInputSearch(newValue); // Update state first
  }
  // Handle Change on cateegory
  function handleCategoryChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSelectedCategory(event.target.value);
  }
  function handleReset() {
    setIsLoadingEvent(true); // set loading to true
    setEmptyResult(false);
    setSelectedCategory("0");
    setInputSearch("");
  }

  // Handler Searching Event
  async function handlerSearchingEvent(
    inputSearch?: string,
    category?: string
  ) {
    if (inputSearch === "" && selectedCategory === "0") {
      setEventIsLimit(false);
      setEmptyResult(false);
      setIsLoadingEvent(true); // set loading to true
      const response: any = await eventHandlerApi.getAllEvent();
      setEventData(response.data);
      setLastCursor(response.cursor);
      setIsLoadingEvent(false);
    } else {
      try {
        setEventIsLimit(false);
        setEmptyResult(false);
        setIsLoadingEvent(true); // set loading to true
        console.log(inputSearch);
        const response: any = await eventHandlerApi.getEventByFilter(
          inputSearch,
          category
        );
        setEmptyResult(response.data.length === 0);
        setEventData(response.data);
        setLastCursor(response.cursor);
      } catch (error: any) {
        console.log(error);
      } finally {
        setIsLoadingEvent(false);
      }
    }
  }

  // Handle Fetching Data
  async function handleGetAllEvent() {
    try {
      setIsLoadingEvent(true); // set loading to true
      const response: any = await eventHandlerApi.getAllEvent();
      setEventData(response.data);
      setLastCursor(response.cursor);
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoadingEvent(false);
    }
  }

  // async handle fething more data
  async function handleFetchMoreData() {
    console.log(lastCursor);
    try {
      setIsLoadingButton(true);
      const response: any = await eventHandlerApi.getMoreEvent(
        lastCursor as number,
        inputSearch,
        selectedCategory
      );
      console.log("Load More Data: ", response.data);
      if (response.data.length === 0) {
        setEventIsLimit(true);
      }
      setEventData((prevState) => [...prevState, ...response.data]);

      setLastCursor(response.cursor);
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoadingButton(false);
      setIsLoadingEvent(false);
    }
  }

  // Handle fetching category
  async function handleGetCategory() {
    try {
      setIsLoadingCategories(true);
      const response: any = await eventHandlerApi.getAllCategories();
      setCategories(response.data);
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoadingCategories(false);
    }
  }

  useEffect(() => {
    // Check the status of render
    if (isInitialRender.current) {
      isInitialRender.current = false;
      handleGetAllEvent();
      handleGetCategory();
    } else {
      const timeoutId = setTimeout(() => {
        handlerSearchingEvent(inputSearch, selectedCategory);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [inputSearch, selectedCategory]);

  return (
    <section id="productSection" className="px-4 py-10">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 gap-10 lg:grid-cols-[325px_1fr]">
        {/* SEARCH INPUT */}
        <div className="w-full lg:max-w-96 flex flex-col gap-6">
          <h2 className="text-gray-950 text-2xl font-bold  lg:text-3xl ">
            EXPLORE OUR EVENT
          </h2>
          <InputField
            id="searchProduct"
            onChange={handleInputSearch}
            type="text"
            value={inputSearch}
            placeholder="Search any events"
          />
          <div>
            <p className="font-semibold text-gray-900 mb-4">
              Filter event by topics
            </p>
            {/* CATEGORY LIST DATA */}
            <Suspense fallback={<CategoryListLoading />}>
              {isLoadingCategories ? (
                <CategoryListLoading />
              ) : (
                <div className="w-fill">
                  <div className="w-auto flex gap-2 overflow-scroll md:flex md:flex-wrap">
                    <RadioChips
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        handleCategoryChange(event)
                      }
                      name="category"
                      text="All Categories"
                      value={0}
                      checked={selectedCategory === "0"}
                    />
                    {categories.map((categories: Category, index: number) => {
                      return (
                        <RadioChips
                          key={index}
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                          ) => handleCategoryChange(event)}
                          name="category"
                          text={categories.category_name}
                          value={categories.category_id}
                          checked={
                            selectedCategory ===
                            categories.category_id.toString()
                          }
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </Suspense>
          </div>
        </div>

        {/* LIST DATA */}
        {emptyResult ? (
          <EmptyResultSection oncClick={handleReset} />
        ) : (
          <Suspense fallback={<EventListLoading />}>
            {isLoadingEvent ? (
              <EventListLoading />
            ) : (
              <EventList
                eventIsLimit={eventIsLimit}
                eventData={eventData}
                isLoading={isLoadingButton}
                onClick={handleFetchMoreData}
              />
            )}
          </Suspense>
        )}
      </div>
    </section>
  );
}

export default EventListSection;

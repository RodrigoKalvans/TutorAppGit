import {Dispatch, useEffect, useRef, useState} from "react";

/**
 * This component is used on the search page to sort the displayed users
 * @param {Array<any>} inputProfiles is used as the collection that is sorted
 * @param {Dispatch<any>} setProfileState is used to update the displayed
 * profiles with the newly sorted collection
 * @return {JSX}
 */
const Sorter = ({
  inputProfiles,
  setProfileState,
} : {
  inputProfiles: Array<any>,
  setProfileState: Dispatch<any>,
}) => {
  const [sortMetric, setSortMetric] = useState<string | undefined>(undefined);
  const lastSortMetric = useRef<typeof sortMetric>(sortMetric);
  const repeat = useRef<boolean>(false); // used to know if same sort is applied over again, in this case the result should be inverted

  // track the previous metric
  useEffect(() => {
    lastSortMetric.current = sortMetric;
    return () => {
      setSortMetric(undefined);
      lastSortMetric.current = undefined;
    };
  }, [sortMetric]);


  const priceSort = (metric = "price") => {
    if (lastSortMetric.current == metric) repeat.current = !repeat.current;
    else repeat.current = false;
    setProfileState(priceQuickSort(inputProfiles, repeat.current));
    setSortMetric(metric);
  };

  const ratingSort = (metric = "rating") => {
    if (lastSortMetric.current == metric) repeat.current = !repeat.current;
    else repeat.current = false;
    setProfileState(ratingQuickSort(inputProfiles, repeat.current ? true : false));
    setSortMetric(metric);
  };

  return (
    <>
      <div className="h-fit rounded-b-2xl bg-white p-2 pb-4">
        <hr className="" />
        <h2 className="uppercase flex justify-center my-3 font-bold">Sort</h2>
        <div className="flex justify-center my-1">
          <div className="btn btn-wide hover:bg-orange-600 bg-orange-500" onClick={() => ratingSort()}>Rating</div>
        </div>
        <div className="flex justify-center my-1">
          <div className="btn btn-wide hover:bg-orange-600 bg-orange-500" onClick={() => priceSort()}>Price</div>
        </div>
      </div>
    </>
  );
};

export default Sorter;

/**
 * Sort profiles based on first lesson price
 * @param {Array<any>} arr pre-sort array
 * @param {boolean} invert sort direction
 * @return {Array<any>} sorted arr
 */
const priceQuickSort: any = (arr: Array<any>, invert: boolean) => {
  if (arr.length <= 1) return arr;

  const pivot = arr.at(0);
  const leftArr = [];
  const rightArr = [];

  for (let i = 1; i < arr.length; i++) {
    // only perform this if the profile has the price field (only tutors do)
    // this way those who do not will not be included in the result
    if (arr.at(i).priceForLessons && pivot.priceForLessons) {
      if (invert) {
        Object.values(arr[i].priceForLessons).at(0)! < Object.values(pivot.priceForLessons).at(0)! ? leftArr.push(arr[i]) : rightArr.push(arr[i]);
      } else {
        Object.values(arr[i].priceForLessons).at(0)! > Object.values(pivot.priceForLessons).at(0)! ? leftArr.push(arr[i]) : rightArr.push(arr[i]);
      }
    }
  }

  return [...priceQuickSort(leftArr, invert), pivot, ...priceQuickSort(rightArr, invert)];
};

/**
 * Sort profiles based on rating
 * @param {Array<any>} arr pre-sort array
 * @param {boolean} invert the sort direction
 * @return {Array<any>} sorted arr
 */
const ratingQuickSort: any = (arr: Array<any>, invert: boolean) => {
  if (arr.length <= 1) return arr;

  const pivot = arr.at(0);
  const leftArr = [];
  const rightArr = [];

  for (let i = 1; i < arr.length; i++) {
    if (invert) {
      arr[i].rating.number < pivot.rating.number ? leftArr.push(arr[i]) : rightArr.push(arr[i]);
    } else {
      arr[i].rating.number > pivot.rating.number ? leftArr.push(arr[i]) : rightArr.push(arr[i]);
    }
  }

  return [...ratingQuickSort(leftArr, invert), pivot, ...ratingQuickSort(rightArr, invert)];
};

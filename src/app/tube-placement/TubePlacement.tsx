import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FilterParams, Sample } from '../../types';
import { getDataUrl, getRandomSample, getSample } from './api';

function filterToParams(filter: FilterParams): URLSearchParams {
  const params = new URLSearchParams();
  if (filter.abnormalETT !== undefined) {
    params.set('abnormalETT', filter.abnormalETT ? '1' : '0');
  }
  if (filter.borderlineETT !== undefined) {
    params.set('borderlineETT', filter.borderlineETT ? '1' : '0');
  }
  if (filter.normalETT !== undefined) {
    params.set('normalETT', filter.normalETT ? '1' : '0');
  }
  if (filter.abnormalNGT !== undefined) {
    params.set('abnormalNGT', filter.abnormalNGT ? '1' : '0');
  }
  if (filter.borderlineNGT !== undefined) {
    params.set('borderlineNGT', filter.borderlineNGT ? '1' : '0');
  }
  if (filter.incompletelyImagedNGT !== undefined) {
    params.set(
      'incompletelyImagedNGT',
      filter.incompletelyImagedNGT ? '1' : '0'
    );
  }
  if (filter.normalNGT !== undefined) {
    params.set('normalNGT', filter.normalNGT ? '1' : '0');
  }
  if (filter.abnormalCVC !== undefined) {
    params.set('abnormalCVC', filter.abnormalCVC ? '1' : '0');
  }
  if (filter.borderlineCVC !== undefined) {
    params.set('borderlineCVC', filter.borderlineCVC ? '1' : '0');
  }
  if (filter.normalCVC !== undefined) {
    params.set('normalCVC', filter.normalCVC ? '1' : '0');
  }
  if (filter.swanGanzCatheterPresent !== undefined) {
    params.set(
      'swanGanzCatheterPresent',
      filter.swanGanzCatheterPresent ? '1' : '0'
    );
  }
  return params;
}

function paramsToFilter(params: URLSearchParams): FilterParams {
  const newFilter: FilterParams = {};
  if (params.has('abnormalETT')) {
    newFilter.abnormalETT = params.get('abnormalETT') === '1';
  }
  if (params.has('borderlineETT')) {
    newFilter.borderlineETT = params.get('borderlineETT') === '1';
  }
  if (params.has('normalETT')) {
    newFilter.normalETT = params.get('normalETT') === '1';
  }
  if (params.has('abnormalNGT')) {
    newFilter.abnormalNGT = params.get('abnormalNGT') === '1';
  }
  if (params.has('borderlineNGT')) {
    newFilter.borderlineNGT = params.get('borderlineNGT') === '1';
  }
  if (params.has('incompletelyImagedNGT')) {
    newFilter.incompletelyImagedNGT =
      params.get('incompletelyImagedNGT') === '1';
  }
  if (params.has('normalNGT')) {
    newFilter.normalNGT = params.get('normalNGT') === '1';
  }
  if (params.has('abnormalCVC')) {
    newFilter.abnormalCVC = params.get('abnormalCVC') === '1';
  }
  if (params.has('borderlineCVC')) {
    newFilter.borderlineCVC = params.get('borderlineCVC') === '1';
  }
  if (params.has('normalCVC')) {
    newFilter.normalCVC = params.get('normalCVC') === '1';
  }
  if (params.has('swanGanzCatheterPresent')) {
    newFilter.swanGanzCatheterPresent =
      params.get('swanGanzCatheterPresent') === '1';
  }
  return newFilter;
}

function FilterItem({
  filterParams,
  setFilterParams,
  label,
  name,
}: {
  filterParams: FilterParams;
  setFilterParams: (filter: (f: FilterParams) => FilterParams) => void;
  label: string;
  name: keyof FilterParams;
}) {
  return (
    <div className="form-control">
      <label className="label cursor-pointer gap-2">
        <input
          type="checkbox"
          checked={filterParams[name] ?? false}
          onChange={e =>
            setFilterParams(f => ({
              ...f,
              [name]: e.target.checked ? true : undefined,
            }))
          }
          className="checkbox"
        />
        <span className="label-text">{label}</span>
      </label>
    </div>
  );
}

export default function App(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();

  const [resultCount, setResultCount] = useState<number>(-1);

  const [filterParams, setFilterParams] = useState<FilterParams>({});

  const [sample, setSample] = useState<Sample | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [showAnswer, setShowAnswer] = useState(false);

  const getRandom = () => {
    setLoading(true);
    getRandomSample(paramsToFilter(searchParams))
      .then(result => {
        setSample(result.sample);
        setResultCount(result.count);
        setSearchParams(p => {
          p.set('id', result.sample.sampleId.toString());
          return p;
        });
      })
      .catch(err => {
        if (err.response.status === 404) {
          setResultCount(0);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const loadPatient = (sampleId: string) => {
    setLoading(true);
    getSample(sampleId!)
      .then(patient => {
        setSample(patient);
        setError(null);
      })
      .catch(err => {
        setSample(null);
        setError(err.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setShowAnswer(false);
  }, [sample]);

  useEffect(() => {
    setFilterParams(paramsToFilter(searchParams));
    const newId = searchParams.get('id');
    if (newId !== null) {
      loadPatient(newId);
    } else {
      getRandom();
    }
  }, [searchParams]);

  const randomClicked = () => {
    setSearchParams(filterToParams(filterParams));
  };

  return (
    <div className="p-8 flex flex-col gap-2">
      <Helmet>
        <title>Tube Placement Database - tube-placement</title>
      </Helmet>
      <div className="text-sm breadcrumbs flex justify-center w-full">
        <ul>
          <li>
            <a href="https://lysine-med.hf.space/">Med</a>
          </li>
          <li>Tube Placement</li>
        </ul>
      </div>
      <p className="text-3xl text-center">Tube Placement Database</p>
      <p className="text-center">
        Filter and access X-rays from the CLiP - Catheter and Line Position
        dataset.
      </p>
      <p className="font-bold">Points to note</p>
      <ul className="list-disc">
        <li>The provided analysis may not be 100% accurate.</li>
        <li>
          There may be multiple tubes or other unrelated tubes in the image.
        </li>
      </ul>
      <div className="collapse collapse-arrow bg-base-200 my-4">
        <input type="checkbox" />
        <div className="collapse-title text-xl font-medium">Select Filters</div>
        <div className="collapse-content">
          <form className="bg-base-200 p-4 pt-0 flex flex-col items-center w-full">
            <fieldset className="w-full" disabled={loading}>
              <div className="divider">Endotracheal tube</div>
              <div className="flex flex-wrap gap-4 justify-center">
                <FilterItem
                  label="Abnormal"
                  name="abnormalETT"
                  filterParams={filterParams}
                  setFilterParams={setFilterParams}
                />
                <FilterItem
                  label="Borderline"
                  name="borderlineETT"
                  filterParams={filterParams}
                  setFilterParams={setFilterParams}
                />
                <FilterItem
                  label="Normal"
                  name="normalETT"
                  filterParams={filterParams}
                  setFilterParams={setFilterParams}
                />
              </div>
              <div className="divider">Nasogastric tube</div>
              <div className="flex flex-wrap gap-4 justify-center">
                <FilterItem
                  label="Abnormal"
                  name="abnormalNGT"
                  filterParams={filterParams}
                  setFilterParams={setFilterParams}
                />
                <FilterItem
                  label="Borderline"
                  name="borderlineNGT"
                  filterParams={filterParams}
                  setFilterParams={setFilterParams}
                />
                <FilterItem
                  label="Incompletely Imaged"
                  name="incompletelyImagedNGT"
                  filterParams={filterParams}
                  setFilterParams={setFilterParams}
                />
                <FilterItem
                  label="Normal"
                  name="normalNGT"
                  filterParams={filterParams}
                  setFilterParams={setFilterParams}
                />
              </div>
              <div className="divider">Central Venous Catheter</div>
              <div className="flex flex-wrap gap-4 justify-center">
                <FilterItem
                  label="Abnormal"
                  name="abnormalCVC"
                  filterParams={filterParams}
                  setFilterParams={setFilterParams}
                />
                <FilterItem
                  label="Borderline"
                  name="borderlineCVC"
                  filterParams={filterParams}
                  setFilterParams={setFilterParams}
                />
                <FilterItem
                  label="Normal"
                  name="normalCVC"
                  filterParams={filterParams}
                  setFilterParams={setFilterParams}
                />
              </div>
            </fieldset>
          </form>
        </div>

        <button
          className="btn btn-primary"
          onClick={randomClicked}
          disabled={loading}
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            'Random Sample'
          )}
        </button>
      </div>
      {resultCount < 0 ? null : (
        <p>{resultCount} samples with the selected filters.</p>
      )}
      {error === null ? null : (
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 className="font-bold">
              An error occurred while loading the sample
            </h3>
            <div className="text-xs">{error}</div>
          </div>
        </div>
      )}
      <div className="divider"></div>
      {sample === null ? null : (
        <div>
          <img src={getDataUrl(sample.sampleId)} alt="X-ray" />
          <div className="collapse collapse-arrow bg-base-200">
            <input
              type="checkbox"
              checked={showAnswer}
              onChange={e => setShowAnswer(e.target.checked)}
            />
            <div className="collapse-title text-xl font-medium">
              Sample Analysis
            </div>
            <div className="collapse-content">
              <div className="p-4 pt-0 flex flex-col items-center w-full gap-4">
                {sample.abnormalETT ? (
                  <p className="text-lg">Abnormal endotracheal tube</p>
                ) : null}
                {sample.borderlineETT ? (
                  <p className="text-lg">Borderline endotracheal tube</p>
                ) : null}
                {sample.normalETT ? (
                  <p className="text-lg">Normal endotracheal tube</p>
                ) : null}
                {sample.abnormalNGT ? (
                  <p className="text-lg">Abnormal nasogastric tube</p>
                ) : null}
                {sample.borderlineNGT ? (
                  <p className="text-lg">Borderline nasogastric tube</p>
                ) : null}
                {sample.incompletelyImagedNGT ? (
                  <p className="text-lg">
                    Incompletely imaged nasogastric tube
                  </p>
                ) : null}
                {sample.normalNGT ? (
                  <p className="text-lg">Normal nasogastric tube</p>
                ) : null}
                {sample.abnormalCVC ? (
                  <p className="text-lg">Abnormal central venous catheter</p>
                ) : null}
                {sample.borderlineCVC ? (
                  <p className="text-lg">Borderline central venous catheter</p>
                ) : null}
                {sample.normalCVC ? (
                  <p className="text-lg">Normal central venous catheter</p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

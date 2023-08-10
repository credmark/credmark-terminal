import { Container } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

import ModelsRuntimeCard from '~/components/pages/Models/ModelUsage/ModelsRuntimeCard';
import ModelsUsageCard from '~/components/pages/Models/ModelUsage/ModelsUsageCard';
import ModelUsageCard from '~/components/pages/Models/ModelUsage/ModelUsageCard';
import TopModelsCard from '~/components/pages/Models/ModelUsage/TopModelsCard';
import SEOHeader from '~/components/shared/SEOHeader';
import env from '~/env';
import {
  ModelMetadata,
  ModelRuntime,
  ModelUsage,
  TopModel,
} from '~/types/model';

export default function ModelUsagePage() {
  const [modelsMetadata, setModelsMetadata] = useState<ModelMetadata[]>([]);
  const [, setModelsMetadataLoading] = useState(false);
  const [, setModelsMetadataError] = useState('');

  const [modelsUsage, setModelsUsage] = useState<ModelUsage[]>([]);
  const [modelsUsageLoading, setModelsUsageLoading] = useState(false);
  const [modelsUsageError, setModelsUsageError] = useState('');

  const [modelsRuntime, setModelsRuntime] = useState<ModelRuntime[]>([]);
  const [modelsRuntimeLoading, setModelsRuntimeLoading] = useState(false);
  const [modelsRuntimeError, setModelsRuntimeError] = useState('');

  const [topModels, setTopModels] = useState<TopModel[]>([]);
  const [topModelsLoading, setTopModelsLoading] = useState(false);
  const [topModelsError, setTopModelsError] = useState('');

  useEffect(() => {
    const abortController = new AbortController();

    setModelsMetadataError('');
    setModelsMetadataLoading(true);
    axios({
      method: 'GET',
      baseURL: env.apiHost,
      url: 'models',
      signal: abortController.signal,
    })
      .then((resp) => {
        setModelsMetadata(resp.data);
      })
      .catch(() => {
        if (!abortController.signal.aborted) {
          setModelsMetadataError(
            'Unable to load models metadata. Please try again later.',
          );
        }
      })
      .finally(() => {
        setModelsMetadataLoading(false);
      });

    setModelsUsageError('');
    setModelsUsageLoading(true);
    axios({
      method: 'GET',
      baseURL: env.apiHost,
      url: 'models/usage',
      signal: abortController.signal,
    })
      .then((resp) => {
        setModelsUsage(resp.data);
      })
      .catch(() => {
        if (!abortController.signal.aborted) {
          setModelsUsageError(
            'Unable to load models metadata. Please try again later.',
          );
        }
      })
      .finally(() => {
        setModelsUsageLoading(false);
      });

    setModelsRuntimeError('');
    setModelsRuntimeLoading(true);
    axios({
      method: 'GET',
      baseURL: env.apiHost,
      url: 'models/runtime',
      signal: abortController.signal,
    })
      .then((resp) => {
        setModelsRuntime(resp.data.runtimes);
      })
      .catch(() => {
        if (!abortController.signal.aborted) {
          setModelsRuntimeError(
            'Unable to load models metadata. Please try again later.',
          );
        }
      })
      .finally(() => {
        setModelsRuntimeLoading(false);
      });

    setTopModelsError('');
    setTopModelsLoading(true);
    axios({
      method: 'GET',
      baseURL: env.apiHost,
      url: 'models/top',
      signal: abortController.signal,
    })
      .then((resp) => {
        setTopModels(resp.data);
      })
      .catch(() => {
        if (!abortController.signal.aborted) {
          setTopModelsError(
            'Unable to load models metadata. Please try again later.',
          );
        }
      })
      .finally(() => {
        setTopModelsLoading(false);
      });

    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <>
      <SEOHeader title="Model Usage" />
      <Container maxW="container.lg" p="8">
        <ModelUsageCard
          loading={modelsUsageLoading}
          error={modelsUsageError}
          modelsUsage={modelsUsage}
        />
        <ModelsUsageCard
          modelsMetadata={modelsMetadata}
          loading={modelsUsageLoading}
          error={modelsUsageError}
          modelsUsage={modelsUsage}
        />
        <ModelsRuntimeCard
          modelsMetadata={modelsMetadata}
          loading={modelsRuntimeLoading}
          error={modelsRuntimeError}
          modelsRuntime={modelsRuntime}
        />
        <TopModelsCard
          modelsMetadata={modelsMetadata}
          loading={topModelsLoading}
          error={topModelsError}
          topModels={topModels}
        />
      </Container>
    </>
  );
}

import express from 'express';
import { z } from 'zod';
import { validate, wrap } from './helper';
import { samples } from './data';
import { notFound } from '@hapi/boom';
import { RandomResult } from '../types';

const router = express.Router();

router.get(
  '/sample/random',
  wrap(async (req, res) => {
    const { query } = await validate(
      req,
      z.object({
        query: z
          .object({
            abnormalETT: z.enum(['0', '1']).optional(),
            borderlineETT: z.enum(['0', '1']).optional(),
            normalETT: z.enum(['0', '1']).optional(),
            abnormalNGT: z.enum(['0', '1']).optional(),
            borderlineNGT: z.enum(['0', '1']).optional(),
            incompletelyImagedNGT: z.enum(['0', '1']).optional(),
            normalNGT: z.enum(['0', '1']).optional(),
            abnormalCVC: z.enum(['0', '1']).optional(),
            borderlineCVC: z.enum(['0', '1']).optional(),
            normalCVC: z.enum(['0', '1']).optional(),
            swanGanzCatheterPresent: z.enum(['0', '1']).optional(),
          })
          .strict(),
      })
    );
    let filtered = samples.slice();
    if (
      !(
        query.abnormalETT === undefined &&
        query.borderlineETT === undefined &&
        query.normalETT === undefined &&
        query.abnormalNGT === undefined &&
        query.borderlineNGT === undefined &&
        query.incompletelyImagedNGT === undefined &&
        query.normalNGT === undefined &&
        query.abnormalCVC === undefined &&
        query.borderlineCVC === undefined &&
        query.normalCVC === undefined &&
        query.swanGanzCatheterPresent === undefined
      )
    ) {
      filtered = filtered.filter(p => {
        if (query.abnormalETT !== undefined) {
          if (p.abnormalETT === (query.abnormalETT === '1')) {
            return true;
          }
        }
        if (query.borderlineETT !== undefined) {
          if (p.borderlineETT === (query.borderlineETT === '1')) {
            return true;
          }
        }
        if (query.normalETT !== undefined) {
          if (p.normalETT === (query.normalETT === '1')) {
            return true;
          }
        }
        if (query.abnormalNGT !== undefined) {
          if (p.abnormalNGT === (query.abnormalNGT === '1')) {
            return true;
          }
        }
        if (query.borderlineNGT !== undefined) {
          if (p.borderlineNGT === (query.borderlineNGT === '1')) {
            return true;
          }
        }
        if (query.incompletelyImagedNGT !== undefined) {
          if (
            p.incompletelyImagedNGT ===
            (query.incompletelyImagedNGT === '1')
          ) {
            return true;
          }
        }
        if (query.normalNGT !== undefined) {
          if (p.normalNGT === (query.normalNGT === '1')) {
            return true;
          }
        }
        if (query.abnormalCVC !== undefined) {
          if (p.abnormalCVC === (query.abnormalCVC === '1')) {
            return true;
          }
        }
        if (query.borderlineCVC !== undefined) {
          if (p.borderlineCVC === (query.borderlineCVC === '1')) {
            return true;
          }
        }
        if (query.normalCVC !== undefined) {
          if (p.normalCVC === (query.normalCVC === '1')) {
            return true;
          }
        }
        if (query.swanGanzCatheterPresent !== undefined) {
          if (
            p.swanGanzCatheterPresent ===
            (query.swanGanzCatheterPresent === '1')
          ) {
            return true;
          }
        }
        return false;
      });
    }
    if (filtered.length === 0) {
      throw notFound('No samples found with the given criteria');
    }
    const sample = filtered[Math.floor(Math.random() * filtered.length)];
    res.status(200).json({
      sample: sample,
      count: filtered.length,
    } satisfies RandomResult);
  })
);

router.get(
  '/sample',
  wrap(async (req, res) => {
    const {
      query: { sampleId },
    } = await validate(
      req,
      z.object({
        query: z
          .object({
            sampleId: z.string(),
          })
          .strict(),
      })
    );
    const _sample = samples.find(p => p.sampleId === sampleId);
    if (!_sample) {
      throw notFound(`Sample ${_sample} not found`);
    }
    res.status(200).json(_sample);
  })
);

export default router;

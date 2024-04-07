#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { App } from 'aws-cdk-lib';

import { MyCdkProjectStack } from '../lib/setup-stack';

const app = new App();  

new MyCdkProjectStack(app,'MyCdkProjectStack');
// emailConn/emailQueue.js
// Simple in-process email queue to handle bulk sends and retries

import sendEmail from './emailProvider.js';

const QUEUE_CONFIG = {
    MAX_RETRIES: 3,
    RETRY_DELAY_MS: 5000,
    BATCH_SIZE: 10,
    PROCESS_INTERVAL_MS: 2000,
};

class EmailQueue {
    constructor() {
        this.queue = [];
        this.processing = false;
        this.stats = { sent: 0, failed: 0, retries: 0, pending: 0 };
        this.processInterval = null;
    }

    /**
     * Adds an email to the processing queue.
     * @param {object} emailPayload
     * @param {number} priority - Lower number = higher priority
     */
    enqueue(emailPayload, priority = 5) {
        this.queue.push({
            ...emailPayload,
            priority,
            retries: 0,
            enqueuedAt: Date.now(),
        });
        this.stats.pending++;

        // Sort by priority (lower number first)
        this.queue.sort((a, b) => a.priority - b.priority);

        if (!this.processing) {
            this.startProcessing();
        }

        console.log(`[EmailQueue] Queued email to: ${emailPayload.to} (Queue size: ${this.queue.length})`);
    }

    /**
     * Starts the queue processing loop.
     */
    startProcessing() {
        this.processing = true;
        this.processInterval = setInterval(async () => {
            if (this.queue.length === 0) {
                this.stopProcessing();
                return;
            }
            await this.processNextBatch();
        }, QUEUE_CONFIG.PROCESS_INTERVAL_MS);
    }

    /**
     * Processes the next batch of emails.
     */
    async processNextBatch() {
        const batch = this.queue.splice(0, QUEUE_CONFIG.BATCH_SIZE);

        const promises = batch.map(async (emailTask) => {
            try {
                await sendEmail(emailTask);
                this.stats.sent++;
                this.stats.pending = Math.max(0, this.stats.pending - 1);
                console.log(`[EmailQueue] Sent email to: ${emailTask.to}`);
            } catch (error) {
                this.stats.pending = Math.max(0, this.stats.pending - 1);
                if (emailTask.retries < QUEUE_CONFIG.MAX_RETRIES) {
                    emailTask.retries++;
                    this.stats.retries++;
                    // Re-enqueue with delay
                    setTimeout(() => {
                        this.queue.push(emailTask);
                        this.stats.pending++;
                    }, QUEUE_CONFIG.RETRY_DELAY_MS * emailTask.retries);
                    console.warn(`[EmailQueue] Email to ${emailTask.to} failed. Retry ${emailTask.retries}/${QUEUE_CONFIG.MAX_RETRIES}.`);
                } else {
                    this.stats.failed++;
                    console.error(`[EmailQueue] Email to ${emailTask.to} permanently failed after ${QUEUE_CONFIG.MAX_RETRIES} retries.`);
                }
            }
        });

        await Promise.allSettled(promises);
    }

    stopProcessing() {
        if (this.processInterval) {
            clearInterval(this.processInterval);
            this.processInterval = null;
        }
        this.processing = false;
    }

    getStats() {
        return { ...this.stats, queueSize: this.queue.length };
    }

    flush() {
        this.queue = [];
        this.stats.pending = 0;
    }
}

export const emailQueue = new EmailQueue();
export default emailQueue;

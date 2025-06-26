import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Button } from "./ui/button";

const FollowModal = ({
  isOpen,
  onClose,
  onFollow,
  onSilentFollow,
  onUnfollow,
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal Panel */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4">
              <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 p-6 text-left align-middle shadow-xl transition-all space-y-5">
                <Dialog.Title className="text-xl font-semibold text-center text-zinc-900 dark:text-zinc-100">
                  {onUnfollow
                    ? "Change your follow type or unfollow"
                    : "Choose how you want to follow"}
                </Dialog.Title>

                <div className="flex flex-col gap-3">
                  {onFollow && (
                    <Button
                      className="w-full text-base py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 dark:bg-indigo-800 dark:hover:bg-indigo-700 dark:text-white"
                      onClick={onFollow}>
                      Follow
                    </Button>
                  )}
                  {onSilentFollow && (
                    <Button
                      className="w-full text-base py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-800 dark:hover:bg-purple-700 dark:text-white"
                      onClick={onSilentFollow}>
                      Silent Follow
                    </Button>
                  )}
                  {onUnfollow && (
                    <Button
                      className="w-full text-base py-2 bg-red-500 hover:bg-red-600 text-white dark:bg-red-700 dark:hover:bg-red-800"
                      onClick={onUnfollow}>
                      Unfollow
                    </Button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default FollowModal;

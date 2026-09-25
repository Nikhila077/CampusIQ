import notificationService from '../services/notificationService.js';

export const getNotifications = async (req, res, next) => {
  try {
    const result = await notificationService.syncAndGetNotifications(req.user._id);
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const markRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await notificationService.markAsRead(req.user._id, id);
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const markAllRead = async (req, res, next) => {
  try {
    const result = await notificationService.markAllAsRead(req.user._id);
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const dismiss = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await notificationService.dismissNotification(req.user._id, id);
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getNotifications,
  markRead,
  markAllRead,
  dismiss
};

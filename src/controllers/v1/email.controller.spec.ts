import { Test, TestingModule } from '@nestjs/testing';
import { EmailController } from './email.controller';
import { EmailDto } from './dto/email-validation.dto';
import { ValidateEmailUsecase } from '../../usecase/validate-email.usecase';

describe('EmailController', () => {
  let emailController: EmailController;
  const validateEmailUsecaseMock = {
    exe: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EmailController],
      providers: [
        {
          provide: ValidateEmailUsecase,
          useValue: validateEmailUsecaseMock,
        },
      ],
    }).compile();

    emailController = app.get<EmailController>(EmailController);
  });

  describe('root', () => {
    it('should return the email id created when email is valid', () => {
      //given
      const emailDtoMock: EmailDto = {
        id: '1234',
        email: 'gvalenncia@gmail.com',
      };
      jest.spyOn(validateEmailUsecaseMock, 'exe').mockReturnValue(emailDtoMock);

      //when
      const result: EmailDto = emailController.postValidateEmail({
        email: 'gvalenncia@gmail.com',
      });

      //then
      expect(result).toBe(emailDtoMock);
    });
  });
});

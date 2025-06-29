import { Test, TestingModule } from '@nestjs/testing';
import { EmailController } from './email.controller';
import { EmailValidationDto } from './dto/email-validation.dto';
import { ValidateEmailUsecase } from '../../usecase/validate-email.usecase';
import { EmailStatus } from '../../domain/entity/email-status.enum';
import { OnboardingStatus } from '../../domain/entity/onboarding-status.enum';
import { Onboarding } from '../../domain/entity/onboarding';

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
    it('should return the email id created when email is valid', async () => {
      //given
      const onboardingCreatedMock = Onboarding.builder()
        .setOnboardingId('1234')
        .setStatus(OnboardingStatus.INITIATED)
        .setEmail('gvalenncia@gmail.com')
        .build();
      const emailValidationDtoMock: EmailValidationDto = {
        onboardingId: '1234',
        email: 'gvalenncia@gmail.com',
      };
      jest
        .spyOn(validateEmailUsecaseMock, 'exe')
        .mockResolvedValue([onboardingCreatedMock, EmailStatus.AVAILABLE]);

      //when
      const result: EmailValidationDto = await emailController.validateEmail({
        email: 'gvalenncia@gmail.com',
      });

      //then
      expect(result).toEqual(emailValidationDtoMock);
    });
  });
});
